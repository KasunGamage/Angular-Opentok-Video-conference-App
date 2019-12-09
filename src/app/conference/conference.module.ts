import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConferenceRoutingModule } from './conference-routing.module';
import { ConferenceComponent } from './conference.component';
import { PublisherComponent } from '../publisher/publisher.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ConferenceComponent, PublisherComponent],
  imports: [
    CommonModule,
    ConferenceRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [PublisherComponent]
})
export class ConferenceModule { }
