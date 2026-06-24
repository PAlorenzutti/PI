import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipeListComponent } from './equipe-list/equipe-list.component';
import { EquipeFormComponent } from './equipe-form/equipe-form.component';
import { DadosGrupoComponent } from './dados-grupo/dados-grupo.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Meu PET'
    },
    children: [
      {
        path: 'equipe',
        data: {
          title: 'Equipe'
        },
        component: EquipeListComponent
      },
      {
        path: 'equipe/novo',
        data: {
          title: 'Cadastrar Extensionista'
        },
        component: EquipeFormComponent
      },
      {
        path: 'dados',
        data: {
          title: 'Dados do Grupo'
        },
        component: DadosGrupoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeuPetRoutingModule { }
