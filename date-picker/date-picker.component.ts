import { Component, ElementRef, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {
  @Input() selectedDate;
  @Input() options;
  @Output() getData = new EventEmitter;
  selectedDateTime: string = '';
  calendarMY: any = null;
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
    if (!!this.options) {
      this.options = Object.assign({}, this.defaultOptions, this.options);
    } else {
      this.options = this.defaultOptions;
    }
    this.processInput();
  }
  defaultToCurrentDate() {
    if (this.options.timePicker) {
      this.selectedTime = moment().format('hh:mmA');
    }
    if (this.options.datePicker) {
      this.selectedDate = moment().format('DD/MM/YYYY');
      this.calendarMY = moment();
    }
    this.selectedDateTime = (this.selectedDate + ' ' + this.selectedTime).trim();
    this.loadCalendar(this.calendarMY);
    this.showCalendar = false;
  }
  processInput() {
    let defaultdate = this.options.timePicker ? moment(this.selectedDate, 'DD/MM/YYYY hh:mmA') : moment(this.selectedDate, 'DD/MM/YYYY');

    // timepicker
    if (this.options.timePicker) {
      this.selectedHour = defaultdate.format('hh');
      this.selectedMinutes = defaultdate.format('mm');
      this.selectedAmPm = defaultdate.format('A');
      this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    }

    //Datepicker 
    if (this.options.datePicker) {
      this.calendarMY = this.calendarMY != null ? this.calendarMY : defaultdate;
    } else {
      this.calendarMY = '';
    }


    if (this.options.timePicker) {
      this.selectedTime = moment(this.selectedDate, 'DD/MM/YYYY hh:mmA').format('hh:mmA');
    } else {
      this.selectedTime = '';
    }
    if (this.options.datePicker) { this.selectedDate = this.calendarMY.format('DD/MM/YYYY') } else {
      this.selectedDate = ''
    }

    this.selectedDateTime = (this.selectedDate + ' ' + this.selectedTime).trim();
  }
  loadCalendar(momentMonth) {
    if (this.options.datePicker) {

      momentMonth = momentMonth.startOf('month');
      this.month = momentMonth.format('MMM');
      let activeMonth = parseInt(momentMonth.month());
      this.year = parseInt(momentMonth.year());
      
      // let prevMonth = momentMonth.add(-1, 'months');
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
        }).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
          this.calendarDates[index].class = "today"
        }
        index++;
      }
      for (let i = 1; i <= this.daysInCurrentMonth; i++) {
        this.calendarDates[index] = { date: i, class: 'active', month: momentMonth.month(), year: momentMonth.year() };     

        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
          this.calendarDates[index].class = "today"
        }
        index++;
      }

      for (let i = 1; i <= 42 - (this.startDayNumber + this.daysInCurrentMonth); i++) {
        this.calendarDates[index] = { date: i, class: 'next', month: nextMonth.month(), year: nextMonth.year() };
        
        if (moment({
          y: this.calendarDates[index].year,
          M: this.calendarDates[index].month,
          d: this.calendarDates[index].date
        }).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
          this.calendarDates[index].class = "today"
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
  chooseDate(dateData) {
    console.log(dateData)
    if (this.options.timePicker) this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    this.selectedDate = moment({ y: dateData.year, M: dateData.month, d: dateData.date }).format('DD/MM/YYYY');
    this.selectedDateTime = (this.selectedDate + ' ' + this.selectedTime).trim();
  }
  changeTime() {
    this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    this.selectedDateTime = (this.selectedDate + ' ' + this.selectedTime).trim();
  }

  apply() {
    if (this.options.timePicker) this.selectedTime = this.selectedHour + ':' + this.selectedMinutes + this.selectedAmPm;
    if (this.selectedDate != null && this.selectedTime != null) {
      if (!this.options.datePicker) this.selectedDate = '';
      this.selectedDateTime = (this.selectedDate + ' ' + this.selectedTime).trim();
      this.getData.emit(this.selectedDateTime);
      this.showCalendar = false;
    }
  }
}

