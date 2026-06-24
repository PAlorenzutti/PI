import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import User from '../../../models/User';
import { catchError, of } from 'rxjs';
import { faCirclePlus, faIdCard, faUser, faBriefcase, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../../../utils/url-api';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit {

  public iconsFa = {
    faCirclePlus,
    faIdCard,
    faUser,
    faBriefcase,
    faFloppyDisk
  };

  public liveForm!: FormGroup;
  public submitted = false;
  
  public userFound?: User;
  public tutorHref?: string;
  public enableTutorUpdate = false;
  
  public visibleRegisterConcluded = false;
  public visibleRegisterFailed = false;
  public visibleUpdateConcluded = false;
  public errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.liveForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: [{ value: '', disabled: true }],
      birthDate: [{ value: '', disabled: true }],
      siape: ['', [Validators.required]],
      departamento: ['', [Validators.required]]
    });
  }

  onUserFound(data: any) {
    this.userFound = data.user;
    this.liveForm.patchValue({
      name: this.userFound?.nome,
      birthDate: this.userFound?.dataNascimento
    });

    if (this.userFound?.tipoUsuario === 'TUTOR') {
       this.enableTutorUpdate = true;
       
       this.http.get(`${URL_API}/api/tutor/search/findByUserEmail?email=${this.userFound.email}`).pipe(catchError(() => of(null))).subscribe({
         next: (tutor: any) => {
           if (tutor && !tutor.error) {
             this.tutorHref = tutor._links.self.href;
             this.liveForm.patchValue({
               siape: tutor.siape,
               departamento: tutor.departamento
             });
           }
         }
       });
    } else {
       this.enableTutorUpdate = false;
       this.tutorHref = undefined;
       this.liveForm.patchValue({ siape: '', departamento: '' });
    }
  }

  onUserNotFound() {
    this.userFound = undefined;
    this.enableTutorUpdate = false;
    this.tutorHref = undefined;
    this.liveForm.patchValue({ name: '', birthDate: '', siape: '', departamento: '' });
  }

  isValid(ctrl: AbstractControl<any, any>) {
    if (ctrl.touched && ctrl.valid) return true;
    else if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
    else return undefined;
  }

  saveAddedTutor() {
    this.submitted = true;

    if (this.liveForm.invalid || !this.userFound) {
      return;
    }

    if (this.enableTutorUpdate && this.tutorHref) {
      const updatePayload = {
        siape: this.liveForm.get('siape')?.value,
        departamento: this.liveForm.get('departamento')?.value
      };

      this.http.patch(this.tutorHref, updatePayload).subscribe({
        next: () => {
          this.toggleSuccessUpdate();
        },
        error: (err) => {
          this.errorMessage = 'Ocorreu um erro ao atualizar os dados do tutor.';
          this.toggleFailedRegister();
        }
      });
    } else {
      const payload = {
        email: this.userFound.email,
        siape: this.liveForm.get('siape')?.value,
        departamento: this.liveForm.get('departamento')?.value
      };

      this.http.post(`${URL_API}/api/user/register-tutor`, payload).subscribe({
        next: () => {
          this.toggleSuccessRegister();
        },
        error: (err) => {
          this.errorMessage = err.error?.status === 'already-tutor' ? 'Este usuário já é um Tutor!' : 'Ocorreu um erro ao salvar.';
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
