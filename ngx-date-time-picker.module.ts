import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class NgxDateTimePickerModule { }
