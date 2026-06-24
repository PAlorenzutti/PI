import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from '../utils/url-api';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private http: HttpClient) { }

  public save(evento: any): Observable<any> {
    return this.http.post(`${URL_API}/api/evento`, evento);
  }

  public update(href: string, evento: any): Observable<any> {
    return this.http.patch(href, evento);
  }

  public getById(id: string | number): Observable<any> {
    return this.http.get(`${URL_API}/api/evento/${id}`);
  }

  public delete(href: string): Observable<any> {
    return this.http.delete(href);
  }
}
