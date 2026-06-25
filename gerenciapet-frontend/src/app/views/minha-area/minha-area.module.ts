import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinhaAreaRoutingModule } from './minha-area-routing.module';
import { EventosComponent } from './eventos/eventos.component';

import {
  CardModule,
  GridModule,
  ButtonModule,
  TableModule,
  ModalModule,
  FormModule,
  BadgeModule
} from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [EventosComponent],
  imports: [
    CommonModule,
    MinhaAreaRoutingModule,
    CardModule,
    GridModule,
    ButtonModule,
    TableModule,
    ModalModule,
    FormModule,
    FontAwesomeModule,
    PaginationModule,
    BadgeModule
  ]
})
export class MinhaAreaModule { }
