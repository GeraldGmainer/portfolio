import type { Localized } from '#shared/types/localized'

// Who the site is about: the JSON-LD person, llms.txt and the markdown pages read this.
export const profile = {
  name: 'Gerald Gmainer',
  givenName: 'Gerald',
  familyName: 'Gmainer',
  email: 'gerald.gmainer@gmail.com',
  image: '/images/profile.jpg',
  github: 'https://github.com/GeraldGmainer',
  linkedin: 'https://www.linkedin.com/in/gerald-gmainer-7924552b1/',
  jobTitle: {
    de: 'Product Owner, UX-Designer und Full-Stack-Entwickler',
    en: 'Product Owner, UX Designer and Full-Stack Developer'
  } satisfies Localized,
  summary: {
    de: 'Product Owner, UX-Designer und Full-Stack-Entwickler aus Garsten bei Steyr, Oberösterreich. Flutter-Apps und Web-Plattformen von der Idee bis zum Release. Offen für Freelance-Projekte.',
    en: 'Product owner, UX designer and full-stack developer from Garsten near Steyr, Upper Austria. Flutter apps and web platforms from idea to release. Open to freelance projects.'
  } satisfies Localized,
  facts: {
    de: [
      'Standort: Garsten bei Steyr, Oberösterreich – remote oder vor Ort',
      'Sprachen: Deutsch, Englisch, Japanisch',
      'Fünf Jahre in Japan gelebt, über vier davon als Entwickler in japanischen Firmen',
      'Certified Scrum Master (2024)',
      'Aktuell: Product Owner für NeuraCharge bei der Hakara GmbH; eigenes Produkt: MoneyKoi'
    ],
    en: [
      'Location: Garsten near Steyr, Upper Austria – remote or on site',
      'Languages: German, English, Japanese',
      'Five years living in Japan, more than four of them as a developer at Japanese companies',
      'Certified Scrum Master (2024)',
      'Currently: product owner for NeuraCharge at Hakara GmbH; own product: MoneyKoi'
    ]
  } satisfies Localized<string[]>
}
