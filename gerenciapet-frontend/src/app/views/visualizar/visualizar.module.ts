import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualizarRoutingModule } from './visualizar-routing.module';
import { GruposPetComponent } from './grupos-pet/grupos-pet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ModalModule,
  TableModule,
  BadgeModule,
  ButtonGroupModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@NgModule({
  declarations: [
    GruposPetComponent
  ],
  imports: [
    CommonModule,
    VisualizarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    CardModule,
    GridModule,
    FormModule,
    TableModule,
    ButtonModule,
    IconModule,
    DropdownModule,
    ModalModule,
    BadgeModule,
    ButtonGroupModule
  ]
})
export class VisualizarModule { }
