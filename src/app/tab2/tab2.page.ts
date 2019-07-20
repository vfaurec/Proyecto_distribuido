import { Component } from '@angular/core'
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../service/api.service';

import { Router } from '@angular/router';


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
    private alertController : AlertController,
    public modalController : ModalController,
    private router: Router
  ) {}

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  
  sendFile(file){

    this.router.navigate(['tab4',file.filename]);
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
  stopAudio() {
    this.audio.stop();
  }

  playAudio(file,idx) {

   // this.playing = true;
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
   
    if (this.platform.is('ios')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
        this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
        this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
        this.audio = this.media.create(this.filePath);
    }
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

}
