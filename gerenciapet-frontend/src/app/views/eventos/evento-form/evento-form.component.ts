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
      horaFim: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      tipo: [TipoEvento.CURSO, [Validators.required]],
      status: [StatusEvento.ABERTO, [Validators.required]]
    }, { validators: this.dateLessThan('dataInicio', 'dataFim') });
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
              const parts = evento.horarios.split(' às ');
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
    const payload: any = { ...this.eventoForm.value };
    
    // Convert to full ISO or local time handling could be placed here if needed.
    // The native date input returns YYYY-MM-DD.
    if (payload.dataInicio) payload.dataInicio = new Date(payload.dataInicio).toISOString();
    if (payload.dataFim) payload.dataFim = new Date(payload.dataFim).toISOString();

    payload.horarios = `${payload.horaInicio} às ${payload.horaFim}`;
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
