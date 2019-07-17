import { Component } from '@angular/core'
import { CaptureError,MediaCapture } from '@ionic-native/media-capture/ngx';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { Platform, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api.service';

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
  APIURL : string = 'http://34.67.11.100:8000/rest';

  constructor(
    public navCtr : NavController,
    public platform : Platform,
    private mediaCapture: MediaCapture, 
    private storage: Storage, 
    private file: File, 
    private media: Media,
    private http: HttpClient,
    private ApiService : ApiService
    
  ) {}

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  sendFile(file){

    this.ApiService.sendPost(file);    

  }

  ionViewWillEnter() {
    this.getAudioList();
  }
 
  getAudioList() {
    if(localStorage.getItem("mediaFiles")) {
      this.mediaFiles = JSON.parse(localStorage.getItem("mediaFiles"));
      //console.log(this.mediaFiles);
    }
  }

  startRecord() {
    
    this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.wav';    
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else {
      //console.log(this.file.externalDataDirectory);
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

  deteleFile(file) {
    this.file.removeFile(this.filePath, this.fileName);
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
  
  captureAudio() {
    this.mediaCapture.captureAudio().then(res => {
      this.storeMediaFiles(res);
    }, (err: CaptureError) => console.error(err));
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

}
