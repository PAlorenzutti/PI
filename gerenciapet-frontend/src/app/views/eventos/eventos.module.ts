import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventosRoutingModule } from './eventos-routing.module';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventoListComponent } from './evento-list/evento-list.component';

import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  TableModule,
  BadgeModule,
  SpinnerModule
} from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskDirective } from 'ngx-mask';

@NgModule({
  declarations: [
    EventoFormComponent,
    EventoListComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    ModalModule,
    TableModule,
    BadgeModule,
    SpinnerModule,
    FontAwesomeModule,
    NgxMaskDirective
  ]
})
export class EventosModule { }
