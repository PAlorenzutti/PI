import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  CardModule,
  GridModule,
  ButtonModule,
  FormModule,
  ModalModule,
  SpinnerModule,
} from '@coreui/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CadastrarRoutingModule } from './cadastrar-routing.module';
import { TutorComponent } from './tutor/tutor.component';
import { GrupoPetComponent } from './grupo-pet/grupo-pet.component';
import { SearchUserComponent } from './components/search-user/search-user.component';

@NgModule({
  declarations: [
    TutorComponent,
    GrupoPetComponent,
    SearchUserComponent
  ],
  imports: [
    CommonModule,
    CadastrarRoutingModule,
    CardModule,
    GridModule,
    ButtonModule,
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    ModalModule,
    SpinnerModule
  ],
  exports: [
    SearchUserComponent
  ]
})
export class CadastrarModule { }
