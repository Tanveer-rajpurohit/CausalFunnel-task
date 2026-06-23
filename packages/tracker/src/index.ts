import trackPageView     from './tracker/pageView';
import initClickTracking from './tracker/click';

interface TrackerConfig {
    backendUrl: string;
}

const initTracker  = (config: TrackerConfig) : void => {
    if (typeof window === 'undefined') return;

    trackPageView(config.backendUrl);
    initClickTracking(config.backendUrl);
}

(window as any).initTracker = initTracker;
(window as any).trackPageView = trackPageView;