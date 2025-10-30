export interface BookingEvent {
    id:number;
    bookingId:number;
    title:number;
    startAt: Date;
    allDay:boolean;
    endAt:Date;
    url:string;
}
