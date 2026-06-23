import getSessionId from '../session/session';
import sendEvent from '../api/sendEvent';

const trackPageView = (backendUrl: string): void => {
    sendEvent(backendUrl, {
        sessionId: getSessionId(),
        eventType: 'page_view',
        pageUrl:   window.location.href,
        timestamp: Date.now(),
    });
};

export default trackPageView;