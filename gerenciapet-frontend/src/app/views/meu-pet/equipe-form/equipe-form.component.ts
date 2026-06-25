import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { UserService } from '../../../services/user.service';
import { TutorService } from '../../../services/tutor.service';
import { faPlus, faTimes, faIdCard, faArrowRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-equipe-form',
  templateUrl: './equipe-form.component.html',
  styleUrl: './equipe-form.component.scss',
  providers: [ExtensionistaService, UserService, TutorService]
})
export class EquipeFormComponent implements OnInit {

  public faIcons = { faPlus, faTimes, faIdCard, faArrowRight, faFloppyDisk };
  public equipeForm!: FormGroup;
  public submitted: boolean = false;
  
  public hasGrupoPet: boolean = false;
  public loading: boolean = true;
  public grupoPet: any;
  public grupoPetId: number = 0;

  public foundUser: any = null;
  public invalidUserType: boolean = false;
  public userAlreadyExtensionista: boolean = false;
  public loadingUserCheck: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private extensionistaService: ExtensionistaService,
    private userService: UserService,
    private tutorService: TutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadTutorData();
  }

  createForm() {
    this.equipeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      dataIngresso: ['', Validators.required],
      bolsista: [false, Validators.required]
    });
  }

  loadTutorData() {
    this.loading = true;
    const logged = this.userService.getLoggedUser?.();
    if (logged && logged.email) {
      this.tutorService.findByUserEmail(logged.email).subscribe({
        next: (tutor: any) => {
          if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
            this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoPet = grupo;
                
                // Extract ID
                if (this.grupoPet._links && this.grupoPet._links.self) {
                  const parts = this.grupoPet._links.self.href.split('/');
                  this.grupoPetId = parseInt(parts[parts.length - 1], 10);
                } else if (this.grupoPet.id) {
                  this.grupoPetId = this.grupoPet.id;
                }
                
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
    } else {
      this.hasGrupoPet = false;
      this.loading = false;
    }
  }

  onUserFound(data: any) {
    const user = data.rawData || data.user;
    if (user && user.tipoUsuario === 'ALUNO' && user.isEstudanteUfes === true) {
      this.loadingUserCheck = true;
      this.extensionistaService.findByUserEmail(user.email).subscribe({
        next: (ext: any) => {
          this.loadingUserCheck = false;
          // Se encontrou, ele já é extensionista
          this.userAlreadyExtensionista = true;
          this.foundUser = null;
          this.invalidUserType = false;
        },
        error: () => {
          // 404 significa que não é extensionista ainda, podemos prosseguir
          this.loadingUserCheck = false;
          this.userAlreadyExtensionista = false;
          this.foundUser = user;
          this.invalidUserType = false;
        }
      });
    } else {
      this.foundUser = null;
      this.invalidUserType = true;
      this.userAlreadyExtensionista = false;
    }
  }

  onUserNotFound() {
    this.foundUser = null;
    this.invalidUserType = false;
    this.userAlreadyExtensionista = false;
  }

  isValid(controlName: string): boolean | undefined {
    const control = this.equipeForm.get(controlName);
    if (!control) return undefined;
    if (this.submitted) {
        return control.valid;
    }
    return control.touched ? control.valid : undefined;
  }

  fechar() {
    this.router.navigate(['/dashboard/meu-pet/equipe']);
  }

  submit() {
    this.submitted = true;
    
    // We also need the user to be found
    if (this.equipeForm.valid && this.foundUser) {
      // Create new Extensionista
      const newExtensionista = {
        dataIngresso: this.equipeForm.value.dataIngresso,
        bolsista: this.equipeForm.value.bolsista,
        user: this.foundUser._links.self.href, // Link to the user
        grupoPet: this.grupoPet._links.self.href // Link to the grupo pet
      };

      this.loading = true;
      this.extensionistaService.create(newExtensionista).subscribe({
        next: () => {
          this.userService.changeUserRole('EXTENSIONISTA', this.foundUser._links.self.href).subscribe({
            next: () => {
              this.router.navigate(['/dashboard/meu-pet/equipe']);
            },
            error: () => {
              this.router.navigate(['/dashboard/meu-pet/equipe']);
            }
          });
        },
        error: () => {
          console.error('Erro ao cadastrar extensionista');
          this.loading = false;
        }
      });
    }
  }
}
