import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Minha Área'
    },
    children: [
      {
        path: '',
        redirectTo: 'eventos',
        pathMatch: 'full'
      },
      {
        path: 'eventos',
        component: EventosComponent,
        data: {
          title: 'Eventos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinhaAreaRoutingModule { }
