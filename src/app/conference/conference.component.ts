import { SharedService } from '../services/shared.service';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpentokService } from '../services/opentok.service';
import * as OT from '@opentok/client';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  sessionId: string;
  token: string;
  publisherEmail: string;
  showMySelf;

  @ViewChild('subcriberDiv', { static: false }) subcriberDiv: ElementRef;
  subscriberDivArray: Array<any> = [];
  subscribers: Array<any> = [];
  mainHeight;
  mainWidth;

  color = 'primary';
  mode = 'indeterminate';
  // value = 50;
  showSpinner = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private opentokService: OpentokService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private renderer: Renderer2,
    private toastService: ToastService
  ) {
    this.sessionId = this.route.snapshot.params.session;
    this.token = this.route.snapshot.params.token;
    this.publisherEmail = this.route.snapshot.params.email;
  }

  ngOnInit() {
    this.showSpinner = true;
    this.setScreenSizes();
    this.checkSelfVideoStatus();
    this.inItSession();
  }

  checkSelfVideoStatus() {
    this.sharedService.getSelfScreenStatus$.subscribe(() => {
      this.showMySelf = !this.showMySelf;
    });
  }

  setScreenSizes() {
    this.mainHeight = window.innerHeight - this.opentokService.toolbarHeight;
    this.mainWidth = window.innerWidth - 40;
  }

  inItSession() {
    this.opentokService
      .initSession(this.sessionId, this.token)
      .then((session: OT.Session) => {
        this.session = session;
        this.session.on('connectionCreated', event => {
          this.doWhenConnectionCreated(event);
        });
        this.session.on('connectionDestroyed', event => {
          this.doWhenConnectionDestroyed(event);
        });
        this.session.on('streamCreated', event => {
          this.doWhenStreamCreated(event);
        });
        this.session.on('streamDestroyed', event => {
          this.doWhenStreamDestroyed(event);
        });
        this.session.on('streamPropertyChanged', event => {
          this.doWhenStreamPropertyChanged(event);
        });
        this.session.on('sessionConnected', event => {
          this.doWhenSessionConnected(event);
        });
        this.session.on('sessionDisconnected', event => {
          this.doWhenSessionDisconnected(event);
        });
        this.session.on('sessionReconnecting', event => {
          this.doWhenSessionReconnecting(event);
        });
        this.session.on('sessionReconnected', event => {
          this.doWhenSessionReconnected(event);
        });
        this.session.on('signal', event => {
          console.log('signal', event);
        });
      })
      .then(() => this.opentokService.connect())
      .catch(err => {
        console.error(err);
        if (err.name === 'OT_NOT_CONNECTED') {
          this.toastService.showError(
            'Error',
            'Faild to connect. Please check your connection and try connecting again!'
          );
        } else {
          this.toastService.showError(
            'Error',
            'An unknown error occurred while connecting. please try again later!'
          );
        }
      });
  }

  doWhenConnectionCreated(event) {
    console.log('connectionCreated', event);
    if (
      event.connection.connectionId === this.session.connection.connectionId
    ) {
      this.toastService.showSuccess(
        'Success',
        'You joined to the conversation as ' + event.connection.data
      );
    } else if (
      event.connection.connectionId !== this.session.connection.connectionId
    ) {
      this.toastService.showSuccess(
        'Success',
        event.connection.data + ' has joined to the conversation.'
      );
    }
  }

  doWhenConnectionDestroyed(event) {
    console.log('connectionDestroyed');
    this.toastService.showSuccess(
      'Succeess',
      event.connection.data + ' has Leave from the conversation.'
    );
  }

  doWhenStreamCreated(event) {
    // console.log('streamCreated', event);
    this.streams.push(event.stream);
    this.sharedService.participantCount = this.streams.length;
    this.sharedService.setJoinStatus('Participant joined');
    this.updateSubscribers();
    this.changeDetectorRef.detectChanges();
  }

  doWhenStreamDestroyed(event) {
    console.log('streamDestroyed', event);
    const idx = this.streams.indexOf(event.stream);
    if (idx > -1) {
      this.streams.splice(idx, 1);
      this.sharedService.participantCount = this.streams.length;
      this.sharedService.setJoinStatus('Participant leave');
      this.updateSubscribers();
      this.changeDetectorRef.detectChanges();
    }
  }

  doWhenSessionConnected(event) {
    // console.log('sessionConnected', event);
    this.showSpinner = false;
  }

  doWhenSessionReconnecting(event) {
    // console.log('sessionReconnecting', event);
    if (
      event.target.connection.connectionId ===
      this.session.connection.connectionId
    ) {
      this.toastService.showWarning(
        'Warning',
        'Disconnected from the session. Attempting to reconnect...'
      );
    }
  }

  doWhenSessionReconnected(event) {
    // console.log('sessionReconnected', event);
    if (
      event.target.connection.connectionId ===
      this.session.connection.connectionId
    ) {
      this.toastService.showSuccess('Success', 'Reconnected to the session...');
    }
  }

  doWhenSessionDisconnected(event) {
    // console.log('sessionDisconnected', event);
    if (event.reason === 'clientDisconnected') {
      this.toastService.showSuccess(
        'Success',
        'You ve left the online meeting!'
      );
    } else if (event.reason === 'networkDisconnected') {
      this.toastService.showWarning(
        'Warning',
        'You lost your internet connection.' +
          ' Please check your connection and try connecting again.'
      );
      // navigate back
    } else if (event.reason === 'forceDisconnected') {
      // when u called Session.forceDisconnect().)
      this.toastService.showWarning(
        'Warning',
        'Someone is remove you from the meeting!'
      );
      // navigate back
    }
  }

  doWhenStreamPropertyChanged(event) {
    // console.log('streamPropertyChanged', event);
    if (
      event.changedProperty === 'hasAudio' &&
      event.newValue === true &&
      event.stream.connection.connectionId ===
        this.session.connection.connectionId
    ) {
      this.sharedService.setAudioStatus(true);
      this.toastService.showSuccess('Success', 'You\'ve Un-Mute the audio!');
    } else if (
      event.changedProperty === 'hasAudio' &&
      event.newValue === false &&
      event.stream.connection.connectionId ===
        this.session.connection.connectionId
    ) {
      this.sharedService.setAudioStatus(false);
      this.toastService.showWarning('Warning', 'You\'ve Mute the audio!');
    } else if (
      event.changedProperty === 'hasVideo' &&
      event.newValue === true &&
      event.stream.connection.connectionId ===
        this.session.connection.connectionId
    ) {
      this.toastService.showSuccess('Success', 'You\'ve Enable the video!');
    } else if (
      event.changedProperty === 'hasVideo' &&
      event.newValue === false &&
      event.stream.connection.connectionId ===
        this.session.connection.connectionId
    ) {
      this.toastService.showWarning('Warning', 'You\'ve Disable the video!');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mainHeight = window.innerHeight - this.opentokService.toolbarHeight;
    this.mainWidth = window.innerWidth - 40;
    this.updateSubscribers();
  }

  updateSubscribers() {
    this.unsubscribeStreamsFromSession();
    this.removeSubscribersDivElements();
    this.addSubscribersDivElements();
  }

  unsubscribeStreamsFromSession() {
    if (this.subscribers.length) {
      this.subscribers.forEach(subscriber => {
        this.session.unsubscribe(subscriber);
      });
      this.subscribers = [];
    }
  }

  removeSubscribersDivElements() {
    if (this.subscriberDivArray.length) {
      this.subscriberDivArray.forEach(divElement => {
        this.renderer.removeChild(this.subcriberDiv.nativeElement, divElement);
      });
      this.subscriberDivArray = [];
    }
  }

  addSubscribersDivElements() {
    this.streams.forEach((stream, index) => {
      const subscriberDivElement = this.renderer.createElement('div');
      this.subscriberDivArray.push(subscriberDivElement);
      this.renderer.setAttribute(subscriberDivElement, 'id', stream.streamId); // Give the replacement div the id of the stream as its id.
      const size = this.calculateSubscriberDivHeightAndWidth(
        this.sharedService.participantCount
      );
      this.renderer.setStyle(subscriberDivElement, 'height', size.height);
      this.renderer.setStyle(subscriberDivElement, 'width', size.width);
      this.renderer.setStyle(subscriberDivElement, 'margin-top', '2px');
      if (this.sharedService.participantCount > 1) {
        if (index === 0 || index === 2 || index === 4 || index === 6) {
          this.renderer.setStyle(subscriberDivElement, 'float', 'left');
          this.renderer.setStyle(subscriberDivElement, 'margin-left', '2px');
        } else if (index === 1 || index === 3 || index === 5 || index === 7) {
          this.renderer.setStyle(subscriberDivElement, 'float', 'right');
          this.renderer.setStyle(subscriberDivElement, 'margin-right', '2px');
        }
      }
      const subscriberOptions: OT.SubscriberProperties = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        fitMode: 'contain',
        subscribeToAudio: true,
        subscribeToVideo: true
        // testNetwork: true // this will disable the sound of subscribers default
      };
      this.renderer.appendChild(
        this.subcriberDiv.nativeElement,
        subscriberDivElement
      );
      const subscriber = this.session.subscribe(
        stream,
        subscriberDivElement.id,
        subscriberOptions,
        err => {
          if (err) {
            console.log('session subscribe error', err);
          } else {
            console.log('Subscriber added.');
          }
        }
      );
      this.subscribers.push(subscriber);
    });
  }

  calculateSubscriberDivHeightAndWidth(subscribersCount: number) {
    const divProps: any = { height: '0px', width: '0px' };
    if (subscribersCount === 1) {
      divProps.height = this.mainHeight + 'px';
      divProps.width = this.mainWidth + 'px';
    } else if (subscribersCount === 2) {
      divProps.height = this.mainHeight + 'px';
      divProps.width = this.mainWidth / 2 + 'px';
    } else if (subscribersCount === 3 || subscribersCount === 4) {
      divProps.height = this.mainHeight / 2 + 'px';
      divProps.width = (this.mainWidth - 2) / 2 + 'px';
    } else if (subscribersCount === 5 || subscribersCount === 6) {
      divProps.height = this.mainHeight / 3 + 'px';
      divProps.width = (this.mainWidth - 2) / 2 + 'px';
    } else if (subscribersCount === 7 || subscribersCount === 8) {
      divProps.height = this.mainHeight / 4 + 'px';
      divProps.width = (this.mainWidth - 2) / 2 + 'px';
    }
    return divProps;
  }
}
