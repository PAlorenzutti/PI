import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { URL_API } from '../utils/url-api';

@Injectable({
  providedIn: 'root'
})
export class GrupoPetService {

  constructor(private http: HttpClient) { }

  public getAllPagedAndSorted(page: number, itensPerPage: number): Observable<any> {
      return this.http.get(
          `${URL_API}/api/grupoPet?page=${page}&size=${itensPerPage}&sort=sigla`
      );
  }

  public findBySiglaContaining(sigla: string, page: number, itensPerPage: number): Observable<any> {
      return this.http.get(
          `${URL_API}/api/grupoPet/search/findBySiglaContainingIgnoreCase?sigla=${sigla}&page=${page}&size=${itensPerPage}&sort=sigla`
      );
  }

  public delete(id: string): Observable<any> {
      return this.http.delete(`${URL_API}/api/grupoPet/delete/${id}`, {
          observe: "response",
      });
  }

  public countGruposPet(): Observable<number> {
      return this.http.get(`${URL_API}/api/grupoPet?size=1`).pipe(
          map((response: any) => response.page.totalElements)
      );
  }

  public getEventos(grupoPetId: string | number): Observable<any> {
      return this.http.get(`${URL_API}/api/grupoPet/${grupoPetId}/eventos`);
  }
}
