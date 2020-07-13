import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreferenceService } from './preference.service';
import { HttpClientModule } from '@angular/common/http';
import { DeliveryClosureComponent } from './delivery-closure/delivery-closure.component';
import { DateButtonComponent } from './date-button/date-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DeliveryClosureComponent,
    DateButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [PreferenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
