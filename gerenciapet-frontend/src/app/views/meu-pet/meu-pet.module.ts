import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MeuPetRoutingModule } from './meu-pet-routing.module';
import { EquipeListComponent } from './equipe-list/equipe-list.component';
import { EquipeFormComponent } from './equipe-form/equipe-form.component';
import { DadosGrupoComponent } from './dados-grupo/dados-grupo.component';

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
  SpinnerModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { CadastrarModule } from '../cadastrar/cadastrar.module';

@NgModule({
  declarations: [
    EquipeListComponent,
    EquipeFormComponent,
    DadosGrupoComponent
  ],
  imports: [
    CommonModule,
    MeuPetRoutingModule,
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
    ButtonGroupModule,
    SpinnerModule,
    FontAwesomeModule,
    CadastrarModule
  ]
})
export class MeuPetModule { }
