import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { faCirclePlus, faIdCard, faBriefcase, faPen, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../../../utils/url-api';
import GrupoPet from '../../../models/GrupoPet';

@Component({
  selector: 'app-grupo-pet',
  templateUrl: './grupo-pet.component.html',
  styleUrls: ['./grupo-pet.component.scss']
})
export class GrupoPetComponent implements OnInit {

  public iconsFa = {
    faCirclePlus,
    faIdCard,
    faBriefcase,
    faPen,
    faFloppyDisk
  };

  public liveForm!: FormGroup;
  public submitted = false;
  
  public grupoPetFound?: GrupoPet;
  public grupoPetHref?: string;
  public enableUpdate = false;
  
  public tutorFound?: any;
  public userFound?: any;
  
  public visibleRegisterConcluded = false;
  public visibleRegisterFailed = false;
  public visibleUpdateConcluded = false;
  public errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.liveForm = this.formBuilder.group({
      siglaBusca: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  lookForSigla() {
    const siglaCtrl = this.liveForm.get('siglaBusca');
    if (!siglaCtrl || !siglaCtrl.valid) return;

    const sigla = siglaCtrl.value;

    this.http.get(`${URL_API}/api/grupoPet/search/findBySigla?sigla=${sigla}`).pipe(catchError(() => of(null))).subscribe({
      next: (grupo: any) => {
        if (grupo && !grupo.error) {
          this.grupoPetFound = new GrupoPet(grupo);
          this.grupoPetHref = grupo._links.self.href;
          this.enableUpdate = true;
          
          this.liveForm.patchValue({
            sigla: this.grupoPetFound.sigla,
            descricao: this.grupoPetFound.descricao
          });
          siglaCtrl.setErrors(null);

          if (grupo._links && grupo._links.tutorCoordenador) {
            this.http.get(grupo._links.tutorCoordenador.href).subscribe((tutor: any) => {
               this.tutorFound = tutor;
               const tutorId = tutor._links.self.href.split('/').pop();
               this.http.get(`${URL_API}/api/user/by-tutor/${tutorId}`).subscribe((user: any) => {
                  this.userFound = user;
                  this.liveForm.patchValue({ email: user.email });
               });
            });
          }
        } else {
          this.grupoPetFound = undefined;
          this.grupoPetHref = undefined;
          this.enableUpdate = false;
          this.tutorFound = undefined;
          this.userFound = undefined;
          this.liveForm.patchValue({ sigla: sigla, descricao: '', email: '' });
          siglaCtrl.setErrors(null);
        }
      }
    });
  }

  onUserFound(data: any) {
    this.tutorFound = data.tutor;
    this.userFound = data.user;
  }

  onUserNotFound() {
    this.tutorFound = undefined;
    this.userFound = undefined;
  }

  isValid(ctrl: AbstractControl<any, any>) {
    if (ctrl.touched && ctrl.valid) return true;
    else if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
    else return undefined;
  }

  saveAddedGrupoPet() {
    this.submitted = true;

    if (this.liveForm.get('sigla')?.invalid || this.liveForm.get('descricao')?.invalid || !this.tutorFound) {
      return;
    }

    const payload = {
      sigla: this.liveForm.get('sigla')?.value,
      descricao: this.liveForm.get('descricao')?.value,
      tutorCoordenador: this.tutorFound._links.self.href
    };

    if (this.enableUpdate && this.grupoPetHref) {
      this.http.patch(this.grupoPetHref, payload).subscribe({
        next: () => {
          this.toggleSuccessUpdate();
        },
        error: (err) => {
          this.errorMessage = 'Ocorreu um erro ao atualizar os dados do Grupo PET.';
          this.toggleFailedRegister();
        }
      });
    } else {
      this.http.post(`${URL_API}/api/grupoPet`, payload).subscribe({
        next: () => {
          this.toggleSuccessRegister();
        },
        error: (err) => {
          this.errorMessage = 'Ocorreu um erro ao salvar o Grupo PET.';
          this.toggleFailedRegister();
        }
      });
    }
  }

  toggleSuccessUpdate() {
    this.visibleUpdateConcluded = true;
    setTimeout(() => {
      this.router.navigate(['./dashboard']);
    }, 2000);
  }

  toggleSuccessRegister() {
    this.visibleRegisterConcluded = true;
    setTimeout(() => {
      this.router.navigate(['./dashboard']);
    }, 2000);
  }

  toggleFailedRegister() {
    this.visibleRegisterFailed = true;
  }

  closeModal() {
    this.visibleRegisterConcluded = false;
    this.visibleRegisterFailed = false;
    this.visibleUpdateConcluded = false;
  }
}
