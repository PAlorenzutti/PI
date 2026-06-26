import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventoListComponent } from './evento-list/evento-list.component';
import { EventoFrequenciaComponent } from './evento-frequencia/evento-frequencia.component';
import { EventoNotasComponent } from './evento-notas/evento-notas.component';
import { EventoCertificadoComponent } from './evento-certificado/evento-certificado.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Eventos e Cursos'
    },
    children: [
      {
        path: 'gerenciar',
        component: EventoListComponent,
        data: {
          title: 'Gerenciar Eventos'
        }
      },
      {
        path: 'novo',
        component: EventoFormComponent,
        data: {
          title: 'Novo Evento'
        }
      },
      {
        path: 'editar/:id',
        component: EventoFormComponent,
        data: {
          title: 'Editar Evento'
        }
      },
      {
        path: 'frequencia',
        component: EventoFrequenciaComponent,
        data: {
          title: 'Controle de Frequência'
        }
      },
      {
        path: 'notas',
        component: EventoNotasComponent,
        data: {
          title: 'Lançamento de Notas'
        }
      },
      {
        path: 'certificados',
        component: EventoCertificadoComponent,
        data: {
          title: 'Emissão de Certificados'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
