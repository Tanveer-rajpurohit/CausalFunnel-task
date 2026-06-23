"use strict";
(() => {
  // src/session/session.ts
  var SESSION_COOKIE = "cf_session";
  var readCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match?.[2] ?? null;
  };
  var writeCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; SameSite=Strict`;
  };
  var getSessionId = () => {
    const existing = readCookie(SESSION_COOKIE);
    if (existing) return existing;
    const id = crypto.randomUUID();
    writeCookie(SESSION_COOKIE, id);
    return id;
  };
  var session_default = getSessionId;

  // src/api/sendEvent.ts
  var sendEvent = (backendUrl, payload) => {
    const url = `${backendUrl}/api/v1/events`;
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {
    });
  };
  var sendEvent_default = sendEvent;

  // src/tracker/pageView.ts
  var trackPageView = (backendUrl) => {
    sendEvent_default(backendUrl, {
      sessionId: session_default(),
      eventType: "page_view",
      pageUrl: window.location.href,
      timestamp: Date.now()
    });
  };
  var pageView_default = trackPageView;

  // src/tracker/click.ts
  var initClickTracking = (backendUrl) => {
    document.addEventListener("click", (e) => {
      sendEvent_default(backendUrl, {
        sessionId: session_default(),
        eventType: "click",
        pageUrl: window.location.href,
        timestamp: Date.now(),
        coordX: e.clientX,
        coordY: e.clientY
      });
    });
  };
  var click_default = initClickTracking;

  // src/index.ts
  var initTracker = (config) => {
    if (typeof window === "undefined") return;
    pageView_default(config.backendUrl);
    click_default(config.backendUrl);
  };
  window.initTracker = initTracker;
})();
