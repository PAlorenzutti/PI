import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeusCertificadosComponent } from '../minha-area/meus-certificados/meus-certificados.component';
import { EventosComponent } from '../minha-area/eventos/eventos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Meu Desempenho'
    },
    children: [
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
          title: 'Certificados'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesempenhoRoutingModule { }
