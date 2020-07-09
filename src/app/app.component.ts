import { Component, OnInit } from '@angular/core';
import { PreferenceService } from './preference.service';
import { AccountPrefrenceDataList } from './accountPrefrenceDataList';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  listaccountPrefs: AccountPrefrenceDataList[];

  listDates;
  removeDuplicates = [];
  sortedDates;
  dayOfWeek;
  accountPrefsReadyObj;

  constructor(private prefService: PreferenceService) {}

  ngOnInit() {
    this.prefService.getAccountPrefs().subscribe((data) => {
      this.listaccountPrefs = data;
      this.listDates = createListOfClosureDates(data);
      this.removeDuplicates = removeDuplicates(this.listDates.split(','));
      this.sortedDates = this.removeDuplicates.sort();
      // populate buttons if(date present) mark as true else false
      // populate button weekday and date
      this.accountPrefsReadyObj = buildDayPref(this.sortedDates);
      console.log(this.accountPrefsReadyObj);
    });
  }
}



function buildDayPref(sortedAndCleanDates) {
  let prefs = [];
  sortedAndCleanDates.forEach(element => {
    let date = element;
    let day = getDayOfWeek(element);
    let pref = {
      date: date,
      day: day,
    };
    prefs.push(pref);
  });
  return prefs;
}

function createListOfClosureDates(preferences) {
  let finalStr = [];

  for (let i = 0; preferences.length > i; i++) {
    finalStr.push(preferences[i].preference);
  }
  return finalStr.toString();
}

function getDayOfWeek(dateClosure) {
  let month = parseInt(dateClosure.slice(0, 2));
  let day = parseInt(dateClosure.slice(3, 5));
  let year = parseInt(dateClosure.slice(6, 10));
  let weekDay = '';

  if (month < 3) {
    month = month + 12;
    year = year - 1;
  }

  let cal = Math.floor(year / 100);
  let key = year - 100 * cal;

  let set =
    Math.floor(2.6 * month - 5.39) +
    Math.floor(key / 4) +
    Math.floor(cal / 4) +
    day +
    key -
    2 * cal;

  let ans = set - 7 * Math.floor(set / 7);

  switch (ans) {
    case 0:
      weekDay = 'Sun';
      break;
    case 1:
      weekDay = 'Mon';
      break;
    case 2:
      weekDay = 'Tues';
      break;
    case 3:
      weekDay = 'Wed';
      break;
    case 4:
      weekDay = 'Thurs';
      break;
    case 5:
      weekDay = 'Fri';
      break;
    case 6:
      weekDay = 'Sat';
  }

  return weekDay;
}

function removeDuplicates(data) {
  return data.filter((value, index) => data.indexOf(value) === index);
}
