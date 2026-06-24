import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorComponent } from './tutor/tutor.component';
import { GrupoPetComponent } from './grupo-pet/grupo-pet.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cadastrar'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tutor'
      },
      {
        path: 'tutor',
        component: TutorComponent,
        data: {
          title: 'Tutor'
        }
      },
      {
        path: 'grupo-pet',
        component: GrupoPetComponent,
        data: {
          title: 'Grupo PET'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastrarRoutingModule { }
