import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class NgxDateTimePickerModule { }
