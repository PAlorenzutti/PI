import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesempenhoRoutingModule } from './desempenho-routing.module';
import { MinhaAreaModule } from '../minha-area/minha-area.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DesempenhoRoutingModule,
    MinhaAreaModule
  ]
})
export class DesempenhoModule { }
