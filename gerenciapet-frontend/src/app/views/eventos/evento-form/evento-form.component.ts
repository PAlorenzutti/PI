import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCalendarPlus, faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { UserService } from '../../../services/user.service';
import { TutorService } from '../../../services/tutor.service';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { EventoService } from '../../../services/evento.service';

import { StatusEvento } from '../../../models/enums/StatusEvento';
import { TipoEvento } from '../../../models/enums/TipoEvento';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss'],
  providers: [TutorService, ExtensionistaService, EventoService]
})
export class EventoFormComponent implements OnInit {

  public faIcons = { faCalendarPlus, faPenToSquare, faFloppyDisk };

  public eventoForm!: FormGroup;
  public submitted = false;
  public loading = true;
  
  public editMode = false;
  public eventoHref?: string;
  
  public hasGrupoPet = false;
  public grupoHref?: string;
  
  public tipoEventoOptions = Object.values(TipoEvento);
  public statusEventoOptions = Object.values(StatusEvento);

  public visibleSuccessModal = false;
  public visibleErrorModal = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tutorService: TutorService,
    private extensionistaService: ExtensionistaService,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.checkUserGrupoPetAndLoad();
  }

  createForm() {
    this.eventoForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      perfilAlunoEsperado: ['', [Validators.required]],
      cargaHorariaTotal: [0, [Validators.required, Validators.min(1)]],
      vagasDisponiveis: [0, [Validators.required, Validators.min(1)]],
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]],
      horaInicio: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      horaFim: [{value: '', disabled: true}, [Validators.required]],
      tipo: [TipoEvento.CURSO, [Validators.required]],
      status: [StatusEvento.ABERTO, [Validators.required]],
      diasSemana: this.formBuilder.group({
        segunda: [false],
        terca: [false],
        quarta: [false],
        quinta: [false],
        sexta: [false],
        sabado: [false],
        domingo: [false]
      })
    }, { validators: [this.dateLessThan('dataInicio', 'dataFim'), this.requireDaysForCurso()]});

    this.eventoForm.valueChanges.subscribe(() => {

      if (this.eventoForm.get('tipo')?.value !== TipoEvento.CURSO){
        this.calculateHoraFim();
      }
      else{
        this.calculaHoraFimCurso();
      }
    });
  }

  calculateHoraFim() {
    const dataInicio = this.eventoForm.get('dataInicio')?.value;
    const dataFim = this.eventoForm.get('dataFim')?.value;
    const carga = this.eventoForm.get('cargaHorariaTotal')?.value;
    const horaInicio = this.eventoForm.get('horaInicio')?.value;

    if (!dataInicio || !dataFim || !carga || !horaInicio || horaInicio.length !== 5) {
      this.eventoForm.get('horaFim')?.setValue('', { emitEvent: false });
      return;
    }

    const d1 = new Date(dataInicio);
    const d2 = new Date(dataFim);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

    let diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1;
    if (diffDays <= 0) diffDays = 1;

    const dailyHours = carga / diffDays;

    const parts = horaInicio.split('h');
    if (parts.length !== 2) return;
    
    const startH = parseInt(parts[0], 10);
    const startM = parseInt(parts[1], 10);
    if (isNaN(startH) || isNaN(startM)) return;

    const startTotalMinutes = startH * 60 + startM;
    const addedMinutes = Math.round(dailyHours * 60);

    const endTotalMinutes = startTotalMinutes + addedMinutes;
    
    const endH = Math.floor(endTotalMinutes / 60) % 24;
    const endM = endTotalMinutes % 60;

    const endHStr = endH.toString().padStart(2, '0');
    const endMStr = endM.toString().padStart(2, '0');
    
    this.eventoForm.get('horaFim')?.setValue(`${endHStr}h${endMStr}`, { emitEvent: false });
  }

  calculaHoraFimCurso() {
    const dataInicioStr = this.eventoForm.get('dataInicio')?.value;
    const dataFimStr = this.eventoForm.get('dataFim')?.value;
    const cargaTotal = this.eventoForm.get('cargaHorariaTotal')?.value;
    const horaInicioStr = this.eventoForm.get('horaInicio')?.value;
    const dias = this.eventoForm.get('diasSemana')?.value; // Pega o grupo de checkboxes

    if (!dataInicioStr || !dataFimStr || !cargaTotal || !horaInicioStr || horaInicioStr.length !== 5 || !dias) {
      this.eventoForm.get('horaFim')?.setValue('', { emitEvent: false });
      return;
    }

    const dataInicio = new Date(dataInicioStr + 'T00:00:00');
    const dataFim = new Date(dataFimStr + 'T00:00:00');

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime()) || dataInicio > dataFim) {
      return;
    }

    const diasSelecionados = [
      dias.domingo, 
      dias.segunda, 
      dias.terca, 
      dias.quarta, 
      dias.quinta, 
      dias.sexta, 
      dias.sabado
    ];

    let totalAulas = 0;
    let dataAtual = new Date(dataInicio);

    while (dataAtual <= dataFim) {
      const diaDaSemana = dataAtual.getDay(); // Retorna de 0 a 6
      
      if (diasSelecionados[diaDaSemana]) {
        totalAulas++; // Contabiliza que haverá aula neste dia!
      }
      
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    // Não escolheu nenhum dia, aborte!
    if (totalAulas === 0) {
      this.eventoForm.get('diasSemana')?.setErrors({ semDiasNoPeriodo: true });
      this.eventoForm.get('horaFim')?.setValue('', { emitEvent: false }); 
      return;
    }
    else{ //Tem que adicionar um negócio aqui, não lembro o nome direito!
      
    }

    const horasPorDia = cargaTotal / totalAulas;

    if (horasPorDia < 0.5) {
      // Carga horária baixa demais para os dias escolhidos!
      this.eventoForm.get('cargaHorariaTotal')?.setErrors({ cargaMuitoPequena: true });
      this.eventoForm.get('horaFim')?.setValue('', { emitEvent: false }); 
      return; 
    } else {
      const errors = this.eventoForm.get('cargaHorariaTotal')?.errors;
      if (errors) {
        delete errors['cargaMuitoPequena'];
        this.eventoForm.get('cargaHorariaTotal')?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    if (horasPorDia > 24) {
      this.eventoForm.get('cargaHorariaTotal')?.setErrors({ cargaMuitoGrande: true });
      this.eventoForm.get('horaFim')?.setValue('', { emitEvent: false });
      return;
    }

    const parts = horaInicioStr.split('h');
    const startH = parseInt(parts[0], 10);
    const startM = parseInt(parts[1], 10);
    if (isNaN(startH) || isNaN(startM)) return;

    const startTotalMinutes = (startH * 60) + startM;
    const addedMinutes = Math.round(horasPorDia * 60);

    const endTotalMinutes = startTotalMinutes + addedMinutes;
    
    const endH = Math.floor(endTotalMinutes / 60) % 24;
    const endM = endTotalMinutes % 60;

    const endHStr = endH.toString().padStart(2, '0');
    const endMStr = endM.toString().padStart(2, '0');
    
    // Atualiza o campo final travado na tela do usuário
    this.eventoForm.get('horaFim')?.setValue(`${endHStr}h${endMStr}`, { emitEvent: false });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} | null => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (!f || !t || !f.value || !t.value) {
        return null;
      }
      if (new Date(f.value) > new Date(t.value)) {
        // Marcamos os controles internos como inválidos também
        if (!f.hasError('dateExceeded')) f.setErrors({ ...f.errors, dateExceeded: true });
        if (!t.hasError('dateExceeded')) t.setErrors({ ...t.errors, dateExceeded: true });
        return { dates: true };
      } else {
        // Limpa o erro customizado se a data for válida
        if (f.hasError('dateExceeded')) {
          let errs = { ...f.errors };
          delete errs['dateExceeded'];
          f.setErrors(Object.keys(errs).length ? errs : null);
        }
        if (t.hasError('dateExceeded')) {
          let errs = { ...t.errors };
          delete errs['dateExceeded'];
          t.setErrors(Object.keys(errs).length ? errs : null);
        }
      }
      return null;
    }
  }
  //Função validadora dos dias do curso!
  requireDaysForCurso(){
    return (group: FormGroup): {[key: string]: any} | null => {
      const tipo = group.controls['tipo']?.value;
      const diasGroup = group.controls['diasSemana'];
      //Caso não seja um curso, só ignoramos!
      if (tipo !== 'CURSO' || !diasGroup) {
        if (diasGroup?.hasError('noDaySelected')) diasGroup.setErrors(null);
        return null;
      }
      //Caso seja um curso, verificamos se foi marcado ao menos um dia
      const dias = diasGroup.value;
      const temAlgumMarcado = Object.values(dias).some(valor => valor === true);
      if (!temAlgumMarcado) {
        diasGroup.setErrors({ noDaySelected: true }); 
        return { requireDays: true }; 
      } else {
        diasGroup.setErrors(null); 
        return null;
      }
    }
  }

  checkUserGrupoPetAndLoad() {
    const loggedUser = this.userService.getLoggedUser?.();
    if (!loggedUser) {
      this.hasGrupoPet = false;
      this.loading = false;
      return;
    }

    const checkRouteAndLoadEvento = () => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.editMode = true;
        this.eventoService.getById(id).subscribe({
          next: (evento) => {
            this.eventoHref = evento._links.self.href;
            let hInicio = '';
            let hFim = '';
            if (evento.horarios) {
              let stringHorarios = evento.horarios;
                if (stringHorarios.includes('|')) {
                stringHorarios = stringHorarios.split('|')[1].trim(); 
              }
              
              const parts = stringHorarios.split(' às ');
              if (parts.length === 2) {
                hInicio = parts[0].replace('h', '');
                hFim = parts[1].replace('h', '');
              }
            }

            this.eventoForm.patchValue({
              nome: evento.nome,
              descricao: evento.descricao,
              perfilAlunoEsperado: evento.perfilAlunoEsperado,
              cargaHorariaTotal: evento.cargaHorariaTotal,
              vagasDisponiveis: evento.vagasDisponiveis,
              dataInicio: evento.dataInicio ? new Date(evento.dataInicio).toISOString().split('T')[0] : '',
              dataFim: evento.dataFim ? new Date(evento.dataFim).toISOString().split('T')[0] : '',
              horaInicio: hInicio ? `${hInicio.substring(0,2)}h${hInicio.substring(2,4)}` : '',
              horaFim: hFim ? `${hFim.substring(0,2)}h${hFim.substring(2,4)}` : '',
              tipo: evento.tipo,
              status: evento.status
            });
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.editMode = false;
        this.loading = false;
      }
    };

    if (loggedUser.tipoUsuario === 'TUTOR') {
      this.tutorService.findByUserEmail(loggedUser.email).subscribe({
        next: (tutor: any) => {
          if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
            this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoHref = grupo._links.self.href;
                checkRouteAndLoadEvento();
              },
              error: () => { this.loading = false; }
            });
          } else {
            this.loading = false;
          }
        },
        error: () => { this.loading = false; }
      });
    } else if (loggedUser.tipoUsuario === 'EXTENSIONISTA') {
      this.extensionistaService.findByUserEmail(loggedUser.email).subscribe({
        next: (ext: any) => {
          if (ext && ext._links && ext._links.grupoPet) {
            this.extensionistaService.getGrupoPetByExtensionistaHref(ext._links.grupoPet.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoHref = grupo._links.self.href;
                checkRouteAndLoadEvento();
              },
              error: () => { this.loading = false; }
            });
          } else {
            this.loading = false;
          }
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.hasGrupoPet = false;
      this.loading = false;
    }
  }

  isValid(field: string): boolean | undefined {
    const ctrl = this.eventoForm.get(field);
    if (!ctrl) return undefined;
    if (ctrl.touched && ctrl.valid) return true;
    if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
    return undefined;
  }

  formatHoraInput(event: any, controlName: string) {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    
    // Validate hours (00-23)
    if (value.length >= 2) {
      const hours = parseInt(value.substring(0, 2), 10);
      if (hours > 23) value = '23' + value.substring(2);
    }
    
    // Validate minutes (00-59)
    if (value.length === 4) {
      const mins = parseInt(value.substring(2, 4), 10);
      if (mins > 59) value = value.substring(0, 2) + '59';
    }

    let formatted = value;
    if (value.length > 2) {
      formatted = value.substring(0, 2) + 'h' + value.substring(2);
    }

    this.eventoForm.get(controlName)?.setValue(formatted, { emitEvent: false });
  }

  submit() {
    this.submitted = true;
    if (this.eventoForm.invalid || (!this.grupoHref && !this.editMode)) return;

    this.loading = true;
    const payload: any = { ...this.eventoForm.getRawValue() };
    
    // Convert to full ISO or local time handling could be placed here if needed.
    // The native date input returns YYYY-MM-DD.
    if (payload.dataInicio) payload.dataInicio = new Date(payload.dataInicio).toISOString();
    if (payload.dataFim) payload.dataFim = new Date(payload.dataFim).toISOString();

    if (this.eventoForm.get('tipo')?.value === 'CURSO') {
      const dias = this.eventoForm.get('diasSemana')?.value;
      const numerosDias = [];
      if (dias.domingo) numerosDias.push(0);
      if (dias.segunda) numerosDias.push(1);
      if (dias.terca) numerosDias.push(2);
      if (dias.quarta) numerosDias.push(3);
      if (dias.quinta) numerosDias.push(4);
      if (dias.sexta) numerosDias.push(5);
      if (dias.sabado) numerosDias.push(6);
      
      payload.horarios = `${numerosDias.join(',')} | ${payload.horaInicio} às ${payload.horaFim}`;
    } else {
      payload.horarios = `${payload.horaInicio} às ${payload.horaFim}`;
    }

    delete payload.horaInicio;
    delete payload.horaFim;
    
    if (this.editMode && this.eventoHref) {
      this.eventoService.update(this.eventoHref, payload).subscribe({
        next: () => {
          this.visibleSuccessModal = true;
          this.loading = false;
        },
        error: () => {
          this.visibleErrorModal = true;
          this.loading = false;
        }
      });
    } else {
      payload.grupoPet = this.grupoHref; // Vincula ao GrupoPET do usuário atual
      this.eventoService.save(payload).subscribe({
        next: () => {
          this.visibleSuccessModal = true;
          this.loading = false;
        },
        error: () => {
          this.visibleErrorModal = true;
          this.loading = false;
        }
      });
    }
  }

  closeModalAndRedirect() {
    this.visibleSuccessModal = false;
    this.eventoForm.reset();
    this.submitted = false;
    if (this.editMode) {
      this.router.navigate(['/dashboard']);
    }
  }

  closeErrorModal() {
    this.visibleErrorModal = false;
  }
}
