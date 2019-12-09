import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { OpentokService } from './services/opentok.service';
import { SharedService } from './services/shared.service';
import { ToastService } from './services/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('toolbar', { static: false }) toolBar: ElementRef;
  videoEnabled = true;
  videoEnabledTxt = 'Stop Video';
  videoEnabledBtnColor;

  audioEnabled = true;
  audioEnabledTxt = 'Mute Audio';
  audioEnabledBtnColor;

  showMySelf = true;
  showMySelfTxt = 'Hide My Screen';
  showMySelfBtnColor;
  formattedTimeElapsed = '00:00:00';
  callTimer: any;
  timeElapsed = 0;

  constructor(
    private toastService: ToastService,
    private opentokService: OpentokService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.checkAudioStatus();
    this.checkVideoStatus();
    this.checkParticipantCountStatus();
  }

  ngAfterViewInit() {
    this.opentokService.toolbarHeight = this.toolBar.nativeElement.clientHeight;
  }

  leaveConvo() {
    this.opentokService.leaveConversation();
    this.stopTimer(true);
  }

  startStopVideo() {
    if (this.videoEnabled) {
      this.opentokService.StopVideo();
      this.sharedService.setVideoStatus(false);
    } else {
      this.opentokService.startVideo();
      this.sharedService.setVideoStatus(true);
    }
  }

  muteAndUnMuteAudio() {
    if (this.audioEnabled) {
      this.opentokService.muteAudio();
      this.sharedService.setAudioStatus(false);
    } else {
      this.opentokService.unMuteAudio();
      this.sharedService.setAudioStatus(true);
    }
  }

  showHideSelfVideo() {
    this.sharedService.setSelfScreenStatus();
    if (this.showMySelf === true) {
      this.showMySelf = false;
      this.showMySelfTxt = 'Show My Screen';
      this.showMySelfBtnColor = 'accent';
      this.toastService.showSuccess('Success', 'You\'ve Hide the Self Screen !');
    } else {
      this.showMySelf = true;
      this.showMySelfTxt = 'Hide My Screen';
      this.showMySelfBtnColor = '';
      this.toastService.showSuccess('Success', 'You\'ve Show the Self Screen !');
    }
  }

  checkAudioStatus() {
    this.sharedService.getAudioStatus$.subscribe(status => {
      if (status === true) {
        this.audioEnabled = true;
        this.audioEnabledTxt = 'Mute Audio';
        this.audioEnabledBtnColor = '';
      } else {
        this.audioEnabled = false;
        this.audioEnabledTxt = 'Un-Mute Audio';
        this.audioEnabledBtnColor = 'accent';
      }
    });
  }

  checkVideoStatus() {
    this.sharedService.getVideoStatus$.subscribe(status => {
      if (status === true) {
        this.videoEnabled = true;
        this.videoEnabledTxt = 'Stop Video';
        this.videoEnabledBtnColor = '';
      } else {
        this.videoEnabled = false;
        this.videoEnabledTxt = 'Start Video';
        this.videoEnabledBtnColor = 'accent';
      }
    });
  }

  checkParticipantCountStatus() {
    this.sharedService.getjoinstatus$.subscribe(status => {
      if (status === 'Participant joined') {
        this.startTimer();
      } else if (status === 'Participant leave') {
        this.stopTimer(false);
      }
    });
  }

  startTimer() {
    if (this.sharedService.participantCount === 1) {
      this.callTimer = setInterval(() => {
        this.timeElapsed++;
        this.formatElapsedTime(this.timeElapsed);
      }, 1000);
    }
  }

  stopTimer(sessionEndedByUser: boolean) {
    if (this.callTimer && sessionEndedByUser) {
      clearInterval(this.callTimer);
    } else {
      if (this.callTimer && this.sharedService.participantCount === 0) {
        clearInterval(this.callTimer);
      }
    }
  }

  formatElapsedTime(timeInSeconds: number) {
    const hh = Math.floor(timeInSeconds / 3600);
    const mm = Math.floor((timeInSeconds - hh * 3600) / 60);
    const ss = timeInSeconds - (hh * 3600 + mm * 60);

    this.formattedTimeElapsed =
      this.padString(hh, 2, '0') +
      ':' +
      this.padString(mm, 2, '0') +
      ':' +
      this.padString(ss, 2, '0');
  }

  padString(
    numberToPad: number,
    padLength: number,
    padCharacter: string
  ): string {
    let paddedString = '';
    if (numberToPad) {
      paddedString = numberToPad.toString();
    }

    let pad = '';
    for (let i = 0; i < padLength; i++) {
      pad += padCharacter;
    }

    // check if the pad length is larger than length of the string needs padding
    if (padLength > paddedString.length && padCharacter.length === 1) {
      paddedString =
        pad.substring(0, padLength - paddedString.length) + paddedString;
    }

    return paddedString;
  }
}
