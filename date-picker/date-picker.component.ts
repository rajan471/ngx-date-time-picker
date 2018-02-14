import { Component, ElementRef, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-date-time-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {
  @Input() selectedDateTime;
  @Input() options;
  @Input() dateTimeFormat;

  @Output() getData = new EventEmitter;
  calendarMY: any = null;
  selectedDate = '';
  startDayNumber: number;
  daysInCurrentMonth: number;
  daysInPrevMonth: number;
  daysInNextMonth: number;
  calendarDates = [];
  calendar = [];
  month = null;
  year = null;
  selectedTime = '';
  showCalendar: boolean = false;
  hours = [];
  minutes = [];
  selectedHour = null;
  selectedMinutes = null;
  selectedAmPm = null;
  choosen = null;
  defaultOptions = {
    datePicker: true,
    timePicker: true
  }
  constructor() {
    this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.minutes = new Array(60).fill(0).map((v, i) => { return ('0' + i).substr(-2, 2) });
  }

  openCalendar() {
    this.showCalendar = true;
    this.loadCalendar(this.calendarMY);
  }
  ngOnInit() {
    this.processInput();
  }
  defaultToCurrentDate() {
    this.selectedDateTime = moment().format(this.dateTimeFormat);

    if (this.options.timePicker && !this.options.datePicker) {
      this.selectedHour = moment().format('hh');
      this.selectedMinutes = moment().format('mm');
      this.selectedAmPm = moment().format('A');
      this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    }
    else if (this.options.datePicker && !this.options.timePicker) {
      this.selectedDateTime = moment().format(this.dateTimeFormat);
      this.calendarMY = moment();
      this.selectedTime = '';
    }
    this.loadCalendar(this.calendarMY);
    this.showCalendar = false;
  }
  processInput() {
    this.options = Object.assign({}, this.defaultOptions, this.options)
    let defaultdate = null;
    if (!!this.selectedDateTime) {
      if (moment(this.selectedDateTime,this.dateTimeFormat).format(this.dateTimeFormat) === 'Invalid date') {
        defaultdate = moment(this.selectedDateTime);
      }else{
        defaultdate = moment(this.selectedDateTime, this.dateTimeFormat);
      }
    }
    else {
      defaultdate = moment();
    }
    // timepicker
    if (!!this.options.timePicker) {
      this.selectedHour = defaultdate.format('hh');
      this.selectedMinutes = defaultdate.format('mm');
      this.selectedAmPm = defaultdate.format('A');
      this.selectedDateTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
      this.calendarMY = '';
      this.selectedTime = this.selectedDateTime;
    }
    //Datepicker 
    else if (!!this.options.datePicker) {
      this.calendarMY = this.calendarMY != null ? this.calendarMY : defaultdate;
      this.selectedTime = '';
      this.selectedDateTime = this.calendarMY.format(this.dateTimeFormat);
      this.selectedDate = this.selectedDateTime;
    }

  }
  loadCalendar(momentMonth) {
    if (this.options.datePicker) {
      momentMonth = momentMonth.startOf('month');
      this.month = momentMonth.format('MMM');
      let activeMonth = parseInt(momentMonth.month());
      this.year = parseInt(momentMonth.year());

      let prevMonth = moment().month(activeMonth).year(this.year).add(-1, 'months');
      let nextMonth = moment().month(activeMonth).year(this.year).add(1, 'months');

      this.startDayNumber = momentMonth.day() - 1;

      this.daysInCurrentMonth = momentMonth.daysInMonth();

      this.daysInPrevMonth = prevMonth.daysInMonth();

      this.daysInNextMonth = nextMonth.daysInMonth();

      this.calendarDates = new Array(42).fill(0);
      let prevDatesStarts = (this.daysInPrevMonth - this.startDayNumber + 1);
      let prevDatesEnds = this.daysInPrevMonth;
      let index = 0
      for (let i = prevDatesStarts; i <= prevDatesEnds; i++) {
        this.calendarDates[index] = { date: i, class: 'prev', month: prevMonth.month(), year: prevMonth.year() };

        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).format(this.dateTimeFormat) == moment().format(this.dateTimeFormat)) {
          this.calendarDates[index].class = "today";
        }
        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).diff(moment(this.selectedDateTime, this.dateTimeFormat)) == 0) {
          this.calendarDates[index].class = this.calendarDates[index].class + " pre-selected";
        }
        index++;
      }
      for (let i = 1; i <= this.daysInCurrentMonth; i++) {
        this.calendarDates[index] = { date: i, class: 'active', month: momentMonth.month(), year: momentMonth.year() };

        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).format(this.dateTimeFormat) == moment().format(this.dateTimeFormat)) {
          this.calendarDates[index].class = "today";
        }
        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).diff(moment(this.selectedDateTime, this.dateTimeFormat)) == 0) {
          this.calendarDates[index].class = this.calendarDates[index].class + " pre-selected";
        }

        index++;
      }

      for (let i = 1; i <= 42 - (this.startDayNumber + this.daysInCurrentMonth); i++) {
        this.calendarDates[index] = { date: i, class: 'next', month: nextMonth.month(), year: nextMonth.year() };

        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).format(this.dateTimeFormat) == moment().format(this.dateTimeFormat)) {
          this.calendarDates[index].class = "today";
        }
        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).diff(moment(this.selectedDateTime, this.dateTimeFormat)) == 0) {
          this.calendarDates[index].class = this.calendarDates[index].class + " pre-selected";
        }
        index++;
      }
      this.calendar[0] = this.calendarDates.slice(0, 7);
      this.calendar[1] = this.calendarDates.slice(7, 14);
      this.calendar[2] = this.calendarDates.slice(14, 21);
      this.calendar[3] = this.calendarDates.slice(21, 28);
      this.calendar[4] = this.calendarDates.slice(28, 35);
      this.calendar[5] = this.calendarDates.slice(35, 42);
    }
  }
  loadPrev() {
    this.calendarMY = this.calendarMY.add(-1, 'months');
    this.loadCalendar(this.calendarMY);
  }
  loadNext() {
    this.calendarMY = this.calendarMY.add(1, 'months');
    this.loadCalendar(this.calendarMY);
  }
  chooseDate(dateData = null) {
    this.choosen = dateData;
    if (!!dateData) {
      this.selectedDate = moment({ y: dateData.year, M: dateData.month, d: dateData.date }).format(this.dateTimeFormat);
      this.selectedDateTime = this.selectedDate;
      this.showCalendar = false;
      this.getData.emit(this.selectedDateTime);
    }
  }
  changeTime() {
    this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    this.selectedDateTime = this.selectedTime;
    this.getData.emit(this.selectedDateTime);
  }

  apply() {
    this.getData.emit(this.selectedDateTime);
    this.showCalendar = false;
  }
  closeCalendar() {
    this.showCalendar = false;
  }
}