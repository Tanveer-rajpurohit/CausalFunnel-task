const sendEvent = (backendUrl: string, payload: Record<string, unknown>): void => {
    const url = `${backendUrl}/api/v1/events`;
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
    }).catch(() => {
        // Silently fail — analytics should never break the host page
    });
};

export default sendEvent;
