import { Component, OnInit } from '@angular/core';
import { PreferenceService } from './preference.service';
import { AccountPrefrenceDataList } from './accountPrefrenceDataList';
import { BehaviorSubject } from 'rxjs';

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

  nyeDayPrefArray = [];
  memDayPrefArray = [];
  independenceDayPrefArray = [];
  laborDayPrefArray = [];
  thanksgivingDayPrefArray = [];
  christmasDayPrefArray = [];

  constructor(private prefService: PreferenceService) { }

  ngOnInit() {
    this.prefService.getAccountPrefs().subscribe((data) => {
      this.listaccountPrefs = data;
      this.listDates = createListOfClosureDates(data);
      this.removeDuplicates = removeDuplicates(this.listDates.split(','));
      this.sortedDates = this.removeDuplicates.sort();
      // populate buttons if(date present) mark as true else false
      // populate button weekday and date
      //this.accountPrefsReadyObj = buildDayPref(this.sortedDates);
      this.nyeDayPrefArray = buildPref_v2(nyeDays, this.sortedDates);
      console.log("This is NYE array " + JSON.stringify(this.nyeDayPrefArray));
      this.memDayPrefArray = buildPref_v2(memDays, this.sortedDates);
      console.log("This is MEm array " + JSON.stringify(this.memDayPrefArray));
      
      this.independenceDayPrefArray = buildPref_v2(indepDays, this.sortedDates);
      console.log("This is 4th array " + JSON.stringify(this.independenceDayPrefArray));
      this.laborDayPrefArray = buildPref_v2(laborDays, this.sortedDates);
      console.log("This is Labor array " + JSON.stringify(this.laborDayPrefArray));

      this.thanksgivingDayPrefArray = buildPref_v2(thanksDays, this.sortedDates);
      console.log("This is Thanksgiving array " + JSON.stringify(this.thanksgivingDayPrefArray));
      this.christmasDayPrefArray = buildPref_v2(christmasDays, this.sortedDates);
      console.log("This is Christmas array " + JSON.stringify(this.christmasDayPrefArray));
      
      
    });
  }
}

let nyeDays = ["12/31/2019", "01/02/2020"];
let memDays = ["05/23/2020", "05/26/2020"];
let indepDays = ["07/03/2020", "07/06/2020"];
let laborDays = ["09/05/2020", "09/08/2020"];
let thanksDays = ["11/25/2020", "11/27/2020", "11/28/2020"];
let christmasDays = ["12/24/2020", "12/26/2020"];

function buildPref_v2(holidayDates, closureDates) {

  let forAllDays = holidayDates;
  //console.log("This is closureDates " + closureDates + " This is Holidays " + holidayDates);
  let prefArray = [];
  for (let i = 0; forAllDays.length > i; i++){
      let date = forAllDays[i].slice(0, 5);
      let day = getDayOfWeek(forAllDays[i]);
      let colorOfTile = isDateClosed(forAllDays[i], closureDates);

      // nyeDays = holidayDates ["12/31/2019", "01/02/2020"] 
      // closureDates all Dates
      
      // for(let j = 0; closureDates.length > j; j++){
      //   if(forAllDays[i].includes(closureDates[j])){
      //     colorOfTile = 'black';
      //   } else {
      //     colorOfTile = 'white';
      //   }
      

      //let isClosed = getClosureDates()
        
    //}
      let dayPref = {
        date: date,
        day: day,
        color: colorOfTile
      }
      prefArray.push(dayPref);
  }
return prefArray;
}

function getNumberOfDaysFromCurrentDate(dateProvided) {
  let businessDayLimit = 14;
  let date = new Date();
  let today = date.toLocaleDateString();

		let d = date.getDate();
		let m  = date.getMonth() + 1;
		let y = date.getFullYear();

    let dateString = (m <= 9 ? '0' + m : m)+ '/' + (d <= 9 ? '0' + d : d)  +  '/' + y;

    let pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 14);
    let dPast = pastDate.getDay();
    let mPast = pastDate.getMonth() + 1;
    let yPast = pastDate.getFullYear();
    
    let pastDateString =  (mPast <= 9 ? '0' + mPast : mPast)+ '/' + (dPast <= 9 ? '0' + dPast : dPast)  +  '/' + yPast;
    console.log("This is past date " + pastDateString);

  //console.log("This is " + today.slice(0,5));
   console.log("This is the dateString " + dateString);
  // console.log("The dateProvided " + dateProvided);


  let isPastDate = true;
  if (dateString > dateProvided || dateProvided === "12/31/2019" || dateString ) {
    isPastDate = true
  } else {
    isPastDate = false
  }
console.log("This is pastDue " + isPastDate);
  return isPastDate;

}

// function getDateSelected(selectedDate, closureDates){

// let isClosureDate = false;

// if(selectedDate === closureDates)
// {
//   isClosureDate = true;
// } else {
//   isClosureDate = false;
// }

//   return isClosureDate;
// }

function isDateClosed(dateSelected, closureDates) {

  let businessDayDate = getNumberOfDaysFromCurrentDate(dateSelected);
  let tileColor = 'white';

  for(let i = 0; closureDates.length > i; i++){
    if ( dateSelected === closureDates[i].slice(0,5)){
      tileColor = 'black';
    } else if (businessDayDate){
      tileColor = 'grey';
    } else {
      tileColor = 'white';
    }
  }


  return tileColor;

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
