import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { MeusCertificadosComponent } from './meus-certificados/meus-certificados.component';

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
      },
      {
        path: 'certificados',
        component: MeusCertificadosComponent,
        data: {
          title: 'Meus Certificados'
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
