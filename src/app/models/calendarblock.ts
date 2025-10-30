export interface CalendarBlock {
    id?:number;
    title:number;
    startAt: Date;
    allDay:boolean;
    endAt:Date;
    repeatInterval:string;
    archived?: Date;
    repeatUntil: Date;
    description:string;
}
