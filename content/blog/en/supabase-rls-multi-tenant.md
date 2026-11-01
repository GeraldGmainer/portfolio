---
title: "Supabase RLS for multi-tenant apps: one header, two rules"
description: "Supabase RLS for multi-tenant apps: how MoneyKoi checks the active tenant with a header and a pre-request hook, and secures reads and writes differently."
date: 2026-10-31
slug: supabase-rls-multi-tenant
key: supabase-rls-multi-tenant
tags: [Supabase, PostgreSQL, Security]
keywords: [Supabase RLS multi-tenant, Supabase row level security, Supabase multi tenancy, PostgREST db_pre_request, Supabase tenant header]
cover: /images/blog/supabase-rls-multi-tenant/cover.en.webp
projects: [moneykoi]
---

In MoneyKoi a budget book is a tenant: a household shares one book, and one person can be a member of several. For this multi-tenant setup I use Supabase RLS (row-level security) with a pre-request hook: before every request it checks the `X-Tenant-Id` header against the caller's memberships and stores the active book. Reads are then limited to the active book, while writes are checked against the book each row belongs to. Lists stay fast, and bookings queued offline still go through after the user has opened another book.

## A book is a tenant

The data model is plain. There is `tenant` (the book), `profile` (the person, global) and `tenant_member` with a role: `owner`, `admin` or `member`. Every data table – accounts, categories, bookings, receipts – has a `tenant_id` column. On sign-up a trigger on `auth.users` creates the profile, a personal book and the owner membership.

A person can have up to three books of their own and be invited to others by link ([see the project](/en/projects/moneykoi)). On the phone and in the browser, switching between them is one tap.

![The book switcher in MoneyKoi's demo mode: a private book, selected, and a shared book the person owns](/images/blog/supabase-rls-multi-tenant/books.webp){width="320" height="711"}

## Why the tenant ID is not in the JWT

A common approach in Supabase is to put the tenant ID into the JWT as a claim and read `auth.jwt()` in the policies. With one tenant per person that works. With several books per person, every switch would need a new token, and a token only ever knows one book.

MoneyKoi does store the user's own book in `app_metadata` on sign-up, but the book that is currently open travels with every request as a header. The header is a wish, not proof. The server decides whether it counts.

## The pre-request hook

PostgREST can run a function before every request. It is registered on the `authenticator` role:

```sql
ALTER ROLE authenticator SET pgrst.db_pre_request TO 'public.db_pre_request';
NOTIFY pgrst, 'reload config';
```

The function looks up the profile from `auth.uid()`, reads the header and checks it against `tenant_member`. If the header is empty or the person is not (or no longer) a member, it falls back to the last book chosen, then to the user's own. Shortened:

```sql
CREATE OR REPLACE FUNCTION public.db_pre_request()
  RETURNS void LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_profile uuid;
  v_wanted  uuid;
  v_active  uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profile WHERE user_id = auth.uid();

  BEGIN
    v_wanted := NULLIF(current_setting('request.headers', true)::json ->> 'x-tenant-id', '')::uuid;
  EXCEPTION WHEN others THEN
    v_wanted := NULL;  -- not a uuid
  END;

  -- Honour the header only for a live membership.
  SELECT tm.tenant_id INTO v_active
  FROM public.tenant_member tm
  WHERE tm.profile_id = v_profile AND tm.tenant_id = v_wanted AND tm.deleted_at IS NULL;

  -- Fallbacks omitted: the last chosen book, then the user's own.

  PERFORM set_config('request.tenant_id', COALESCE(v_active::text, ''), false);
  PERFORM set_config('request.profile_id', COALESCE(v_profile::text, ''), false);
END;
$$;
```

Three details:

- An invalid header leads to the fallback, not to an error. The response therefore says nothing about whether the other book exists.
- `set_config(…, false)` lasts for the whole session, not just the transaction. The hook runs before every request and overwrites the values, so no old value stays behind. `true` would be cleaner.
- The real function also sets the role in the active book (`request.role`).

Because the book comes with every request, server and app agree even when the switch happened offline and the server never heard about it.

## Helper functions in their own schema

The policies read these values through small functions in an `internal` schema that the API does not expose:

```sql
CREATE FUNCTION internal.current_tenant() RETURNS uuid
  LANGUAGE sql STABLE SET search_path = ''
AS $$ SELECT NULLIF(current_setting('request.tenant_id', true), '')::uuid $$;

CREATE FUNCTION internal.is_member_of(p_tenant uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_member tm
    WHERE tm.tenant_id = p_tenant
      AND tm.profile_id = internal.current_profile()
      AND tm.deleted_at IS NULL)
$$;
```

`is_member_of` runs as `SECURITY DEFINER` so that its query on `tenant_member` does not have to pass that table's own RLS again. That avoids recursion and saves time. `SET search_path = ''` means everything must be fully qualified, and no other schema can slip in a function with the same name. For the functions the whole tenant separation depends on, that is not optional.

The real `current_tenant()` also falls back to `app_metadata.tenant_id` in the JWT after `request.tenant_id`. That matters for realtime.

## Asymmetric Supabase RLS: read the active book, write the row's book

Now the core. The policies for bookings first looked like this:

```sql
CREATE POLICY booking_select ON public.booking FOR SELECT
  USING (internal.is_current_tenant(tenant_id));

CREATE POLICY booking_insert ON public.booking FOR INSERT
  WITH CHECK (internal.can_write_booking(tenant_id));

CREATE POLICY booking_update ON public.booking FOR UPDATE
  USING (internal.can_write_booking(tenant_id))
  WITH CHECK (internal.can_write_booking(tenant_id));
```

`can_write_booking` checks membership of the row's book, not of the active book. Why two different rules?

- **Narrow reads.** Lists, dashboards and totals always work within one book. `tenant_id = <one value>` maps straight onto an index, and even a query without a filter returns only the open book.
- **Writes against the row.** The app writes offline into an outbox ([how that works](/en/blog/offline-first-flutter-supabase)). Someone who records three bookings in book B, switches to book A and only then gets a signal would see three rejected bookings under an "active book only" rule. With the membership rule they go through.

Then there is the role. Day-to-day data – bookings, receipts, tags, the shopping list – can be written by any member. The book's structure – accounts, categories, savings goals, rules – only by owners and admins. A second function, `can_write`, checks `role_in(tenant_id) IN ('owner', 'admin')` for that.

It still doesn't work without the matching header. Postgres also applies the SELECT policy to rows returned by `RETURNING` ([CREATE POLICY in the Postgres docs](https://www.postgresql.org/docs/current/sql-createpolicy.html)), and the app needs the returned row because it carries the server's timestamps. So every outbox entry carries the ID of its book and is sent with exactly that book as `X-Tenant-Id`. The write rule decides whether the write is allowed; the header makes sure the response is readable.

## Realtime has no header

The hook runs before every PostgREST request, but not for realtime. Supabase checks `postgres_changes` events against the SELECT policy using only the subscriber's JWT. Without `request.tenant_id`, `current_tenant()` fell back to `app_metadata.tenant_id` – always the user's own book. Members of a shared book therefore got no events for it, and their phones only caught up on the next pull. I noticed in October 2026.

The fix is a function that returns something different depending on the path:

```sql
CREATE FUNCTION internal.readable_tenant_ids() RETURNS uuid[]
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, internal, pg_temp
AS $$
  SELECT CASE
    -- REST: the hook set an active book
    WHEN NULLIF(current_setting('request.tenant_id', true), '') IS NOT NULL
      THEN ARRAY[internal.current_tenant()]
    -- Realtime: every book the caller belongs to
    ELSE ARRAY(SELECT tm.tenant_id FROM public.tenant_member tm
               WHERE tm.profile_id = internal.current_profile()
                 AND tm.deleted_at IS NULL)
  END
$$;

CREATE POLICY booking_select ON public.booking FOR SELECT
  USING (tenant_id = ANY ((SELECT internal.readable_tenant_ids())::uuid[]));
```

Three details:

- The function is wrapped in `(SELECT …)` so Postgres evaluates it once per statement rather than once per row.
- The cast to `uuid[]` is not decoration. Without it, `= ANY (SELECT …)` is the subquery form and compares `uuid` with `uuid[]`.
- The result is an array, not an `OR`. A version with `OR internal.is_member_of(tenant_id)` would be shorter, but it takes the tenant condition out of the index. Every REST query without its own tenant filter – most of the web app's – would then scan every book sequentially.

The price: an `ORDER BY` on another column, such as the date, can no longer walk the `(tenant_id, date)` index in order and sorts the book's rows instead.

REST stays limited to the header, and realtime sees every book the person belongs to. Which book the app listens to is set when it subscribes, with the filter `tenant_id=eq.<active book>`.

## Limits

- **I test the policies by hand.** Risky migrations come with SQL scripts that I run against the local database, but there are no automated RLS tests in CI.
- **Every new table needs the same care.** A table without RLS is open through the API. The rule in the project: no table without policies, and every new realtime table gets the array policy, or members of shared books never hear about it.

## Takeaways

- Send the active tenant as a request header and check it against the membership on the server. The client asks, the server decides.
- Limit reads to the active tenant and check writes against the row's tenant whenever writes can arrive late.
- Keep RLS helper functions in a schema outside the API, with `SET search_path = ''` and, where needed, `SECURITY DEFINER`.
- Realtime evaluates policies without the pre-request hook. Every policy has to hold from that angle too.

---

MoneyKoi is [available as an Android app on Google Play](https://play.google.com/store/apps/details?id=com.psyren.moneykoi). More information at [moneykoi.com](https://www.moneykoi.com).
