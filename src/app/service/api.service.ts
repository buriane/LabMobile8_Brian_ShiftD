import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  apiURL() {
    return 'http://localhost/mahasiswa';
  }

  tampil(link: string): Observable<any> {
    return this.http.get(this.apiURL() + '/' + link);
  }

  tambah(data: any, link: string): Observable<any> {
    return this.http.post(this.apiURL() + '/' + link, data);
  }

  edit(data: any, link: string): Observable<any> {
    return this.http.put(this.apiURL() + '/' + link, data);
  }

  hapus(id: any, link: string): Observable<any> {
    return this.http.delete(this.apiURL() + '/' + link + id);
  }

  lihat(id: any, link: string): Observable<any> {
    return this.http.get(this.apiURL() + '/' + link + id);
  }
}