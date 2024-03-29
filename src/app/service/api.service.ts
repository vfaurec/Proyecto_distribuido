import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    console.log(this.http.get(this.api+'/rest/?format=json'));
    return this.http.get( this.api+'/rest/?format=json');
  }
  
  upload(file) {
    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: file,
       chunkedMode:false,
       mimeType: 'audio/wav',
       headers: {}
    }
   
      this.fileTransfer.upload( this.storage+file, this.api+ '/upload/', options)
     .then((data) => {
      console.log(data);
       // success    
     }, (err) => {
      console.log(err);
       // error
     });
    }

}
