import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventoListComponent } from './evento-list/evento-list.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
