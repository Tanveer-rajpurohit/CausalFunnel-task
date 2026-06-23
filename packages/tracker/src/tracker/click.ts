import getSessionId from '../session/session';
import sendEvent from '../api/sendEvent';

const initClickTracking = (backendUrl: string): void => {
    document.addEventListener('click', (e: MouseEvent) => {
        sendEvent(backendUrl, {
            sessionId: getSessionId(),
            eventType: 'click',
            pageUrl:   window.location.href,
            timestamp: Date.now(),
            coordX:    e.clientX,
            coordY:    e.clientY,
        });
    });
};

export default initClickTracking;