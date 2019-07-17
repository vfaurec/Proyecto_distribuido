import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api : string  = 'http://34.67.11.100:8000';

  constructor( 
    private http : HttpClient ) { }

  getResponse() {
    return this.http.get( this.api+'/rest/?format=json');
  }

  sendPost(file){
    console.log(file);
    this.http.post( this.api+'/upload', file
    ).subscribe((response) => {
      console.log(response);
    });
  }

}
