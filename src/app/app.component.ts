import { Component, OnInit } from '@angular/core';
import { PreferenceService } from './preference.service';
import { AccountPrefrenceDataList } from './accountPrefrenceDataList';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(){}
}
