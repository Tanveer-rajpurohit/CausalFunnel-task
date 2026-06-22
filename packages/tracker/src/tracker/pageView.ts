import getSessionId from '../session/session';

const trackPageView = (backendUrl: string): void => {
    console.log({
        session_id: getSessionId(),
        event_type: 'page_view',
        page_url:   window.location.href,
        timestamp:  Date.now(),
    });
};

export default trackPageView;