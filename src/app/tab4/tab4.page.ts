import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  consulta: any;
  api : string  = 'http://34.67.11.100:8000';
  storage : string = 'file:///storage/emulated/0/Android/data/io.ionic.devapp/files/';

  constructor( 
    private http : HttpClient,
    private transfer: FileTransfer,
    private router: Router,
    public activatedRoute: ActivatedRoute, ) { }
    
    ngOnInit(){

      this.consulta = this.activatedRoute.snapshot.paramMap.get('consulta');
          console.log(this.consulta);
          this.upload(this.consulta);
  
    }


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
