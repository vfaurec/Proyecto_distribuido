import { Component } from '@angular/core'
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { MediaCapture } from '@ionic-native/media-capture/ngx';


const MEDIA_FILES_KEY = 'mediaFiles';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  mediaFiles : any[] = [];

  constructor(
    public navCtrl : NavController,
    public platform : Platform,
    private storage: Storage, 
    private file: File, 
    private media: Media,
    private mediaCapture : MediaCapture,
    private ApiService : ApiService,
    private alertController : AlertController,
    public modalController : ModalController    
  ) {}

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  sendFile(file){

        //this.presentAlertLoading();
        this.ApiService.upload(file.filename);
  }

  async presentAlertLoading() {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();
  
    const alert = await alertController.create({
      header: 'Enviando audio',
      subHeader: '',
      message: 'Espere, por favor.',
    });
    return await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Eliminar Audio',
      message: 'Message <strong>Desea eliminar el archivo?</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.getAudioList();
  }
 
  getAudioList() {
    if(localStorage.getItem("mediaFiles")) {
      this.mediaFiles = JSON.parse(localStorage.getItem("mediaFiles"));
    }
  }
 
  captureAudio() {
    this.mediaCapture.captureAudio().then(res => {
      this.storeMediaFiles(res);
    });
  }

  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })
  }

  playAudio(file,idx) {

    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {      
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  startRecord() {
    
    this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.wav';    
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else {
      this.filePath = this.file.tempDirectory + this.fileName;
    }
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.mediaFiles.push(data);
    localStorage.setItem("mediaFiles", JSON.stringify(this.mediaFiles));
    this.recording = false;
    this.getAudioList();
  }

  deleteFile(file){


    this.file = file;
    this.file.removeFile(this.ApiService.storage+file.filename, file.filename).then( data => {
      console.log('file removed: ', this.file);
      data.fileRemoved.getMetadata(function (metadata) {
          let name = data.fileRemoved.name;
          let size = metadata.size ;
          let fullPath = data.fileRemoved.fullPath;
          console.log('Deleted file: ', name, size, fullPath) ;
          console.log('Name: ' + name + ' / Size: ' + size) ;
      }) ;
  }).catch( error => {
      file.getMetadata(function (metadata) {
          let name = file.name ;
          let size = metadata.size ;
          console.log('Error deleting file from cache folder: ', error) ;
          console.log('Name: ' + name + ' / Size: ' + size) ;
      }) ;
  });
  }

  



}
