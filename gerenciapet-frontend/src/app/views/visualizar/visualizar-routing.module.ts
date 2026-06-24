import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposPetComponent } from './grupos-pet/grupos-pet.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Visualizar'
    },
    children: [
      {
        path: 'grupos-pet',
        data: {
          title: 'Grupos PET'
        },
        component: GruposPetComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualizarRoutingModule { }
