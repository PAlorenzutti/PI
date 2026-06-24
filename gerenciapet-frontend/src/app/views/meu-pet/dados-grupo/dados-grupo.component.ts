import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { TutorService } from '../../../services/tutor.service';
import { URL_API } from '../../../utils/url-api';
import { faBriefcase, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dados-grupo',
  templateUrl: './dados-grupo.component.html',
  styleUrls: ['./dados-grupo.component.scss'],
  providers: [TutorService]
})
export class DadosGrupoComponent implements OnInit {

  public faIcons = { faBriefcase, faFloppyDisk };

  public grupoForm!: FormGroup;
  public loading = true;
  public hasGrupoPet = false;
  public isTutor = false;
  
  public grupoHref?: string;
  public submitted = false;
  
  public visibleUpdateConcluded = false;
  public visibleUpdateFailed = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tutorService: TutorService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.checkTutorAndGrupo();
  }

  createForm(): void {
    this.grupoForm = this.formBuilder.group({
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]]
    });
  }

  checkTutorAndGrupo(): void {
    const loggedUser = this.userService.getLoggedUser?.();
    if (!loggedUser || loggedUser.tipoUsuario !== 'TUTOR') {
      this.isTutor = false;
      this.loading = false;
      return;
    }
    this.isTutor = true;

    this.tutorService.findByUserEmail(loggedUser.email).subscribe({
      next: (tutor: any) => {
        if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
          const assocHref = tutor._links.grupoPetCoordena.href;
          this.tutorService.getGrupoPetByTutorHref(assocHref).subscribe({
            next: (grupo: any) => {
              this.hasGrupoPet = true;
              this.grupoHref = grupo._links.self.href;
              this.grupoForm.patchValue({
                sigla: grupo.sigla,
                descricao: grupo.descricao
              });
              this.loading = false;
            },
            error: () => {
              this.hasGrupoPet = false;
              this.loading = false;
            }
          });
        } else {
          this.hasGrupoPet = false;
          this.loading = false;
        }
      },
      error: () => {
        this.hasGrupoPet = false;
        this.loading = false;
      }
    });
  }

  isValid(field: string): boolean | undefined {
    const ctrl = this.grupoForm.get(field);
    if (!ctrl) return undefined;
    if (ctrl.touched && ctrl.valid) return true;
    if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
    return undefined;
  }

  submit(): void {
    this.submitted = true;
    if (this.grupoForm.invalid || !this.grupoHref) {
      return;
    }

    const payload = {
      sigla: this.grupoForm.get('sigla')?.value,
      descricao: this.grupoForm.get('descricao')?.value
    };

    this.loading = true;
    this.http.patch(this.grupoHref, payload).subscribe({
      next: () => {
        this.loading = false;
        this.visibleUpdateConcluded = true;
      },
      error: () => {
        this.loading = false;
        this.visibleUpdateFailed = true;
      }
    });
  }

  closeModal(): void {
    this.visibleUpdateConcluded = false;
    this.visibleUpdateFailed = false;
  }
}
