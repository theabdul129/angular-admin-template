import {
  OnInit,
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  Injectable,
  ViewEncapsulation
} from '@angular/core';

import {
  addDays,
  addMinutes,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';

import { Subject } from 'rxjs';
import { WeekViewHourSegment } from 'calendar-utils';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { CalendarBlock } from 'app/models/calendarblock';
import { BookingEvent } from 'app/models/bookingevent';

import { CalendarPeriod } from 'app/models/calendarperiod';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['calendar.component.css'],
  templateUrl: 'calendar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  activeDayIsOpen = true;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  @Input('calendarPeriod') calendarPeriod: CalendarPeriod;
  @Input() refreshCalendar = 0;

  events: CalendarEvent[] = [];
  @Output() onFetchEvents: EventEmitter<any> = new EventEmitter();
  @Output() onDayClick: EventEmitter<any> = new EventEmitter();
  @Output() onAddEvent: EventEmitter<any> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.fetchEvents();
  }
  setView(view: CalendarView) {
    this.view = view;
    this.fetchEvents();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.fetchEvents();
  }
  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ event: BookingEvent }>>;
  }): void {
    this.onDayClick.emit(date);

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ event: BookingEvent }>): void {
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (event.meta.event.bookingId == undefined) {
      this.onAddEvent.emit(event);
    } else {
      // this.modal.open(this.modalContent, { size: 'lg' });
    }
  }
  fetchEvents() {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const period = {
      start: getStart(this.viewDate),
      end: getEnd(this.viewDate)
    };
    this.onFetchEvents.emit(period);

    if (this.view == 'day') {
      this.onDayClick.emit(period.start);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'refreshCalendar') {
        if (
          changes[property].firstChange == false &&
          changes[property].previousValue != changes[property].currentValue
        ) {
          this.fetchEvents();
        }
      } else if (property === 'calendarPeriod') {
        if (changes[property].currentValue != undefined) {
          this.events = changes[property].currentValue.bookingEvents.map(
            (event: BookingEvent) => {
              return {
                title: event.title,
                start: event.startAt,
                end: event.endAt,
                color: colors.yellow,
                allDay: event.allDay,
                meta: {
                  event
                }
              };
            }
          );

          this.events = this.events.concat(
            changes[property].currentValue.calendarBlocks.map(
              (event: CalendarBlock) => {
                return {
                  title: event.title,
                  start: event.startAt,
                  end: event.endAt,
                  color: colors.red,
                  allDay: event.allDay,
                  meta: {
                    event
                  }
                };
              }
            )
          );

          this.refresh.next();
        }
      }
    }
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true
      }
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refreshView();
          this.onAddEvent.emit(dragToSelectEvent);
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshView();
      });
  }

  private refreshView() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
