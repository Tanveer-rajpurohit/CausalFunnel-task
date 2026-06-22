interface BaseEvent {
    session_id: string;
    page_url: string;
    timestamp: number;
}

interface PageViewEven extends BaseEvent{
    event_type: "page_view",
    time_spent?: number // extra
}

interface ClickEvent  extends BaseEvent{
    event_type: "click";
    coord_x: number;
    coord_y: number;
}