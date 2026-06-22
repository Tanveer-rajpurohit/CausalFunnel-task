import getSessionId from '../session/session';

const initClickTracking = (backendUrl: string): void => {
    document.addEventListener('click', (e: MouseEvent) => {
        console.log({
            session_id: getSessionId(),
            event_type: 'click',
            page_url:   window.location.href,
            timestamp:  Date.now(),
            coord_x:    e.clientX,
            coord_y:    e.clientY,
        });
    });
};

export default initClickTracking;