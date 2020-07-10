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
  sortedDates = [11];
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
  let openDates = ["12/31/2019", "01/02/2020", "05/23/2020", "05/26/2020","07/03/2020", "07/06/2020", "09/05/2020", "09/08/2020",
                    "11/25/2020", "11/27/2020", "11/28/2020", "12/24/2020",  "12/26/2020"];

  for(let i = 0; openDates.length > i; i++){
    let closedDates = sortedAndCleanDates;
    let closed;
    let day = getDayOfWeek(openDates[i]);
    
    if (openDates.includes(closedDates[i])){
      closed = true;
    } else {
      closed = false
    }

    let pref = {
      date: openDates[i],
      day: day,
      isClosed: closed
    };
    prefs.push(pref);
  }
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
