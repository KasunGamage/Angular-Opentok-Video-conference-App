import { Injectable } from '@angular/core';
import * as OT from '@opentok/client';

import { VirtualHealth } from 'src/app/constants/virtual-health';

@Injectable({
  providedIn: 'root'
})
export class OpentokService {
  session: OT.Session;
  publisher: OT.Publisher;
  token: string;
  toolbarHeight: number;
  constructor() {}

  getOT() {
    return OT;
  }

  // initSession(session, token) {
  //   if (
  //     VirtualHealth.OPEN_TOK_API_KEY &&
  //     VirtualHealth.TOKEN &&
  //     VirtualHealth.SESSIONID
  //   ) {
  //     this.session = this.getOT().initSession(
  //       VirtualHealth.OPEN_TOK_API_KEY,
  //       VirtualHealth.SESSIONID
  //     );
  //     this.token = VirtualHealth.TOKEN;
  //     return Promise.resolve(this.session);
  //   } else {
  //     return fetch(VirtualHealth.SAMPLE_SERVER_BASE_URL + '/session')
  //       .then(data => data.json())
  //       .then(json => {
  //         this.session = this.getOT().initSession(json.apiKey, json.sessionId);
  //         this.token = json.token;
  //         return this.session;
  //       });
  //   }
  // }

  initSession(session, token) {
      this.session = this.getOT().initSession(VirtualHealth.OPEN_TOK_API_KEY, session);
      this.token = token;
      return Promise.resolve(this.session);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, err => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }

  leaveConversation() {
    this.session.disconnect();
    setTimeout(function afterTwoSeconds() {
      window.close();
    }, 4000);
  }

  StopVideo() {
    this.publisher.publishVideo(false);
  }

  startVideo() {
    this.publisher.publishVideo(true);
  }

  muteAudio() {
    this.publisher.publishAudio(false);
  }

  unMuteAudio() {
    this.publisher.publishAudio(true);
  }

}
