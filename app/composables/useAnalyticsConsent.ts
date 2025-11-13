export function useAnalyticsConsent() {
    const consent = useState<boolean>('va-consent', () => false)
    const decided = useState<boolean>('va-decided', () => false)
    const ready = useState<boolean>('va-ready', () => false)

    onMounted(() => {
        const v = localStorage.getItem('va-consent')
        if (v === '1') {
            consent.value = true
            decided.value = true
        } else if (v === '0') {
            consent.value = false
            decided.value = true
        }
        ready.value = true
    })

    const accept = () => {
        consent.value = true
        decided.value = true
        localStorage.setItem('va-consent', '1')
    }

    const decline = () => {
        consent.value = false
        decided.value = true
        localStorage.setItem('va-consent', '0')
    }

    return {consent, decided, ready, accept, decline}
}
