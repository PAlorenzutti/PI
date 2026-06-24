import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';

@Injectable({
  providedIn: 'root'
})
export class ExtensionistaService {

  constructor(private http: HttpClient) { }

  public findByGrupoPetId(grupoPetId: number, page: number, itensPerPage: number): Observable<any> {
    return this.http.get(
        `${URL_API}/api/extensionista/search/findByGrupoPetId?grupoPetId=${grupoPetId}&page=${page}&size=${itensPerPage}&projection=comUser`
    );
  }

  public findByUserEmail(email: string): Observable<any> {
    return this.http.get(`${URL_API}/api/extensionista/search/findByUserEmail?email=${email}`);
  }

  public getGrupoPetByExtensionistaHref(grupoPetHref: string): Observable<any> {
    return this.http.get(grupoPetHref);
  }

  public create(extensionista: any): Observable<any> {
    return this.http.post(`${URL_API}/api/extensionista`, extensionista);
  }

  public delete(id: string | number): Observable<any> {
    return this.http.delete(`${URL_API}/api/extensionista/${id}`, { observe: "response" });
  }
}
