import trackPageView     from './tracker/pageView';
import initClickTracking from './tracker/click';

interface TrackerConfig {
    backendUrl: string;
}

declare global {
    interface Window {
        initTracker: (config: TrackerConfig) => void;
        trackPageView: (backendUrl: string) => void;
    }
}

const initTracker  = (config: TrackerConfig) : void => {
    if (typeof window === 'undefined') return;

    trackPageView(config.backendUrl);
    initClickTracking(config.backendUrl);
}

window.initTracker = initTracker;
window.trackPageView = trackPageView;