import { CalendarBlock } from 'app/models/calendarblock';
import { BookingEvent } from 'app/models/bookingevent';


export interface CalendarPeriod {
bookingEvents: [BookingEvent];
calendarBlocks: [CalendarBlock];
    startDate: Date;
    endDate:Date;
}
