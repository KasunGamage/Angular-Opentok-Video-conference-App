import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { OpentokService } from '../services/opentok.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit, AfterViewInit {
  @ViewChild('publisherDiv', { static: false}) publisherDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() publisherEmail: string;
  publisher: OT.Publisher;
  publishing: boolean;

  constructor(private opentokService: OpentokService) {
    this.publishing = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const OT = this.opentokService.getOT();
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
      insertMode: 'append',
      publishAudio: true,
      publishVideo: true,
      name: this.publisherEmail // set the name of the user
    });

    this.opentokService.publisher = this.publisher;

    if (this.session) {
      // tslint:disable-next-line:no-string-literal
      if (this.session['isConnected']()) {
        this.publish();
      }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }
}
