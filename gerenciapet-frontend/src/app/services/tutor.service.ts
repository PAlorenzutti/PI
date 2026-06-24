import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  constructor(private http: HttpClient) { }

  public findByUserEmail(email: string): Observable<any> {
    return this.http.get(`${URL_API}/api/tutor/search/findByUserEmail?email=${email}`);
  }

  public getGrupoPetByTutorHref(grupoPetHref: string): Observable<any> {
    return this.http.get(grupoPetHref);
  }
}
