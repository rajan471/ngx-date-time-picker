# ngx-date-time-picker

Angular 5 Date-time picker

### Dependencies
- Moment.js
- FormsModule

### Plugin Usage

You can use this in the following manner. 

1. Import the package Module as
```ts
import { NgxDateTimePickerModule } from  'ngx-date-time-picker';
```

Then in component file use the date-time-picker as follows:
```ts
<app-date-picker [selectedDate]="date" (getData)="getStartDateTime($event)" [options]="{timePicker: false}"></app-date-picker>

```

[SelectedDate] takes input ```date``` defined in the component.ts file as:

```ts
date: string;

constructor(){
    this.date = moment().format('DD/MM/YYYY hh:mmA');
}
```
```(getData)``` will provide the formatted date as ```$event```.

### Plugin options

Right now there are only two options to the plugin:

#### Default options
```ts
this.options = {
    datePicker: true,
    timePicker: true
}
```

If you need datePicker only then pass ```timePicker: false``` or vice-versa.

I will soon be updating the plugin with more options.