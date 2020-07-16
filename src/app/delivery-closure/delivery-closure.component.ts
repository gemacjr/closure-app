import { Component, OnInit, Output } from '@angular/core';
import { PreferenceService } from '../preference.service';
import { AccountPrefrenceDataList } from '../accountPrefrenceDataList';


@Component({
  selector: 'app-delivery-closure',
  templateUrl: './delivery-closure.component.html',
  styleUrls: ['./delivery-closure.component.css']
})
export class DeliveryClosureComponent implements OnInit {

  constructor(private prefService: PreferenceService) { }

  lastEditedId: string;;
  lastEditedDate: string;
  useApiDataFromSessionStorage: any;

  listaccountPrefs: AccountPrefrenceDataList = new AccountPrefrenceDataList();

  listDates: any;
  removeDuplicatesList = [];
  sortedDates: any;
  dayOfWeek;
  accountPrefsReadyObj;

  nyeDayPrefArray: string[];
  memDayPrefArray: string[];
  independenceDayPrefArray: string[];
  laborDayPrefArray: string[];
  thanksgivingDayPrefArray: string[];
  christmasDayPrefArray: string[];
  dataObject: any;
  myObj: any;
  theObjectId;

  formattedDate;

  nyeDays = ["12/31/2019", "01/02/2020"];
  memDays = ["05/23/2020", "05/26/2020"];
  indepDays = ["07/03/2020", "07/06/2020"];
  laborDays = ["09/05/2020", "09/08/2020"];
  thanksDays = ["11/25/2020", "11/27/2020", "11/28/2020"];
  christmasDays = ["12/24/2020", "12/26/2020"];

  ngOnInit() {
    this.getPreferences();

  }


  public getPreferences() {
    console.log('Called DeliveryClosureComponent::getAccoutnPreferences');
    this.useApiDataFromSessionStorage = JSON.parse(sessionStorage.getItem("userAPIData"));
    console.log(" Session Storage " + this.useApiDataFromSessionStorage);

    this.prefService.getAccountPrefs()
      .subscribe(data => {
        this.listaccountPrefs = data;
        console.log("The USer id " + data.lastEditedBy);
        sessionStorage.setItem('prefApi', JSON.stringify(data));
        this.useApiDataFromSessionStorage = sessionStorage.getItem('prefApi');
        this.myObj = JSON.parse(this.useApiDataFromSessionStorage);
        this.lastEditedId = this.myObj[0].lastUpdatedBy;
        this.formattedDate = this.convertGMTtoEST(this.myObj[0].lastUpdateTimeStamp);
        this.lastEditedDate = this.getParseDate(this.formattedDate);
        this.listDates = this.createListOfClosureDates(data);
        this.removeDuplicates = this.removeDuplicates(this.listDates.split(','));
        this.sortedDates = this.removeDuplicatesList.sort();
        this.nyeDayPrefArray = this.buildPrefObj(this.nyeDays, this.listDates);
        this.memDayPrefArray = this.buildPrefObj(this.memDays, this.listDates);
        this.independenceDayPrefArray = this.buildPrefObj(this.indepDays, this.listDates);
        this.laborDayPrefArray = this.buildPrefObj(this.laborDays, this.listDates);
        this.thanksgivingDayPrefArray = this.buildPrefObj(this.thanksDays, this.listDates);
        this.christmasDayPrefArray = this.buildPrefObj(this.christmasDays, this.listDates);
      });
  }




  public buildPrefObj(holidayDates, closureDates) {
    let theClosedDates = closureDates;;
    let forAllDays = holidayDates;
    let prefArray = [];
    for (let i = 0; forAllDays.length > i; i++) {
      let date = forAllDays[i].slice(0, 5);
      let month = this.getMonth(forAllDays[i].slice(0, 2));
      let monthDay = month + " " + date.slice(3, 5);
      let day = this.getDayOfWeek(forAllDays[i]);
      let isPassed = this.getNumberOfDaysFromCurrentDate(forAllDays[i]);
      let isSelected = this.isDateClosed(forAllDays[i], theClosedDates);
      if (isPassed && isSelected) {
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

  public getMonth(month) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthName = monthNames[parseInt(month) - 1];
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
    if (closureDates.includes(dateSelected)) {
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

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDay = weekDays[ans];

    return weekDay;
  }

  public removeDuplicates(data) {
    return data.filter((value, index) => data.indexOf(value) === index);
  }

  public getParseDate(lastEditedDate) {

    let today = new Date();
    let str = today.toDateString()
    console.log("The str " + str);
    console.log("The lastEditeddate " + lastEditedDate);
    let formattedDate = '';
    let month = this.getMonth(lastEditedDate.slice(0, 2));
    let day = lastEditedDate.slice(3, 5);

    let year = lastEditedDate.slice(6, 10);
    formattedDate = month + " " + day + ", " + year;
    return formattedDate;

  }

  public convertGMTtoEST(lastEditedDate) {
    let date = new Date(lastEditedDate);
    let estDate = date.setHours(date.getHours() - 4);
    let tmpDate = new Date(estDate);
    let convertedDate = tmpDate.toLocaleDateString();

    if (convertedDate.length === 9) {
      convertedDate = "0" + convertedDate;
    }
    return convertedDate;
  }


}
