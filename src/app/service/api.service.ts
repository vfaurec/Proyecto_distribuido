import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api : string  = 'http://34.67.11.100:8000/rest';

  constructor( private http : HttpClient  ) { }

  getResponse() {
    return this.http.get( this.api+'/?format=json');
  }

}
