import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api : string  = 'http://34.67.11.100:8000';
  storage : string = 'file:///storage/emulated/0/Android/data/io.ionic.devapp/files/';

  constructor( 
    private http : HttpClient,
    private transfer: FileTransfer ) { }


  fileTransfer: FileTransferObject = this.transfer.create();

    
  getResponse() {
    return this.http.get( this.api+'/rest/?format=json');
  }
  
  upload(fileName) {
    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: fileName,
       chunkedMode:false,
       headers: {}
    }
  
    this.fileTransfer.upload( this.storage + fileName, this.api+ '/upload/', options)
     .then((data) => {
      console.log(data);
       // success    
     }, (err) => {
      console.log(err);
       // error
     });
  }

}
