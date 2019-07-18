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
  photo : string;

  constructor( private apiService : ApiService ) 
  { }

  ngOnInit() {

    this.apiService.getResponse()
    .subscribe(
      (data) => { // Success
       console.log(data);
        this.genero = data['genero'];
        this.edad = data['edad'];
        this.photo = this.genero + '-' + this.edad + '.svg';
      },
      (error) =>{
        console.error(error);
      }
    )
   }

}
