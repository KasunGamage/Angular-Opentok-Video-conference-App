import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  participantCount: number;

  private participantCountStatus = new Subject<string>();
  private joinstatus = new Subject<string>();

  private selfScreenStatus = new Subject<boolean>();
  private audioStatus = new Subject<boolean>();
  private videoStatus = new Subject<boolean>();

  // Observable navItem stream
  getjoinstatus$ = this.joinstatus.asObservable();

  getSelfScreenStatus$ = this.selfScreenStatus.asObservable();
  getAudioStatus$ = this.audioStatus.asObservable();
  getVideoStatus$ = this.videoStatus.asObservable();

  constructor() {}

  // service command
  setJoinStatus(val) {
    this.joinstatus.next(val);
  }

  // test commit
  setSelfScreenStatus() {
    this.selfScreenStatus.next(true);
  }

  setAudioStatus(status) {
    this.audioStatus.next(status);
  }

  setVideoStatus(status) {
    this.videoStatus.next(status);
  }
}
