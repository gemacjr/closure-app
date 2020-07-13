import { Component, OnInit, Output } from '@angular/core';
import { PreferenceService } from '../preference.service';
import { AccountPrefrenceDataList } from '../accountPrefrenceDataList';

@Component({
  selector: 'app-delivery-closure',
  templateUrl: './delivery-closure.component.html',
  styleUrls: ['./delivery-closure.component.css']
})
export class DeliveryClosureComponent implements OnInit {

lastEditedByUser = 'Ed'
lastEditedDate = "09";

useApiDataFromSessionStorage: any;

listaccountPrefs: AccountPrefrenceDataList[];

  listDates;
  removeDuplicatesList = [];
  sortedDates: any;
  dayOfWeek;
  accountPrefsReadyObj;

  nyeDayPrefArray = [];
  memDayPrefArray = [];
  independenceDayPrefArray = [];
  laborDayPrefArray = [];
  thanksgivingDayPrefArray = [];
  christmasDayPrefArray = [];
  dataObject;

nyeDays = ["12/31/2019", "01/02/2020"];
 memDays = ["05/23/2020", "05/26/2020"];
 indepDays = ["07/03/2020", "07/06/2020"];
 laborDays = ["09/05/2020", "09/08/2020"];
 thanksDays = ["11/25/2020", "11/27/2020", "11/28/2020"];
 christmasDays = ["12/24/2020", "12/26/2020"];

  constructor(private prefService: PreferenceService) { }

  ngOnInit() {
    this.getPreferences();
    
  }


public getPreferences(){
  console.log('Called DeliveryClosureComponent::getAccoutnPreferences');
  this.useApiDataFromSessionStorage = JSON.parse(sessionStorage.getItem("userAPIData"));
  //console.log(" Session Storage " + this.useApiDataFromSessionStorage.id);

  this.prefService.getAccountPrefs().subscribe((data) => {
    this.listaccountPrefs = data;

    this.listDates = this.createListOfClosureDates(data);
    this.removeDuplicates = this.removeDuplicates(this.listDates.split(','));
    this.sortedDates = this.removeDuplicatesList.sort();
    this.nyeDayPrefArray = this.buildPrefObj(this.nyeDays, this.listDates);
     this.memDayPrefArray = this.buildPrefObj(this.memDays, this.sortedDates);
     this.independenceDayPrefArray = this.buildPrefObj(this.indepDays, this.listDates);
     this.laborDayPrefArray = this.buildPrefObj(this.laborDays, this.listDates);
    this.thanksgivingDayPrefArray = this.buildPrefObj(this.thanksDays, this.listDates);
    this.christmasDayPrefArray = this.buildPrefObj(this.christmasDays, this.listDates);
  });
}




public buildPrefObj(holidayDates, closureDates) {
  let theClosedDates  = closureDates;;
  let forAllDays = holidayDates;
  let prefArray = [];
  for (let i = 0; forAllDays.length > i; i++) {
    let date = forAllDays[i].slice(0, 5);
    let month = this.getMonth(forAllDays[i].slice(0,2));
    let monthDay = month + " " + date.slice(3,5);
    let day = this.getDayOfWeek(forAllDays[i]);
    let isPassed = this.getNumberOfDaysFromCurrentDate(forAllDays[i]);
    let isSelected = this.isDateClosed(forAllDays[i], theClosedDates);
    if(isPassed && isSelected ){
      isSelected = false;
    }
    let dayPref = {
      date: monthDay,
      day: day,
      isPassed: isPassed,
      isSelected: isSelected
    }
    prefArray.push(dayPref);
  }
  return prefArray;
}

public getMonth(month){
  let monthName;
  switch(month){
    case "01":
      monthName = "Jan";
      break;
    case "02":
      monthName = "Feb";
      break;
    case "03":
      monthName = "Mar";
      break;
    case "04":
      monthName = "Apr";
      break;
    case "05":
      monthName = "May";
      break;
    case "06":
      monthName = "Jun";
      break;
    case "07":
      monthName = "July"
      break;
    case "08":
      monthName = "Aug";
      break;
    case "09":
      monthName = "Sep";
      break;
    case "10":
      monthName = "Oct";
      break;
    case "11":
      monthName = "Nov";
      break;
    default:
      monthName = "Dec";
  }
  return monthName;
}

public getNumberOfDaysFromCurrentDate(dateProvided) {

  let holidayDays = ["01/01/2020", "05/25/2020", "07/04/2020", "09/07/2020", "11/26/2020", "12/25/2020"]
  let date = new Date();
  let dayIs14FromHoliday = true;

  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let todayDateString = (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

  let pastDate = Date.now() + -14 * 24 * 3600 * 1000;
  let pastDateMinus14 = new Date(pastDate);
  let past14Date = pastDateMinus14.toLocaleDateString;
  let dPast = pastDateMinus14.getDate();
  let mPast = pastDateMinus14.getMonth() + 1;
  let yPast = pastDateMinus14.getFullYear();

  let pastDateString = (mPast <= 9 ? '0' + mPast : mPast) + '/' + (dPast <= 9 ? '0' + dPast : dPast) + '/' + yPast;
  
  holidayDays.forEach(element => {
    if (element === pastDateString) {
      dayIs14FromHoliday = true;
    } else {
      dayIs14FromHoliday = false;
    }
  });

  let isPastDate = true;
  if (todayDateString > dateProvided || dateProvided === "12/31/2019" || dayIs14FromHoliday) {
    isPastDate = true
  } else {
    isPastDate = false
  }
  return isPastDate;
}

public isDateClosed(dateSelected, closureDates) {

  let isClosed;
  if(closureDates.includes(dateSelected)){
    isClosed = true;
  } else {
    isClosed = false;
  }
  return isClosed;
}

public createListOfClosureDates(preferences) {
  let finalStr = [];

  for (let i = 0; preferences.length > i; i++) {
    finalStr.push(preferences[i].preference);
  }
  return finalStr.toString();
}

public getDayOfWeek(dateClosure) {
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
      weekDay = 'Tue';
      break;
    case 3:
      weekDay = 'Wed';
      break;
    case 4:
      weekDay = 'Thu';
      break;
    case 5:
      weekDay = 'Fri';
      break;
    case 6:
      weekDay = 'Sat';
  }
  return weekDay;
}

public removeDuplicates(data) {
  return data.filter((value, index) => data.indexOf(value) === index);
}



}
