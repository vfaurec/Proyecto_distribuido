import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})

export class Tab3Page implements OnInit {

  genero : string;
  edad : string;

  constructor( private apiService : ApiService ) 
  { }

  ngOnInit() {

   this.apiService.getResponse()
   .subscribe(
     (data) => { // Success
       this.genero = data['genero'];
       this.edad = data['edad'];
     },
     (error) =>{
       console.error(error);
     }
   )
  }
}
