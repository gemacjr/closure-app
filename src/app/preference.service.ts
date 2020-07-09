import  { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PreferenceService {

  apiUrl = 'http://localhost:3000/accountPreferenceDataList';

  constructor(private httpClient: HttpClient){}

  getAccountPrefs(): Observable<any> {
    return this.httpClient.get(this.apiUrl);
  }

}

  