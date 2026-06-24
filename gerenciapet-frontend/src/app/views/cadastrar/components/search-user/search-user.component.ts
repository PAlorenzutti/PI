import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import User from '../../../../models/User';
import { URL_API } from '../../../../utils/url-api';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: []
})
export class SearchUserComponent implements OnInit {

  public iconsFa = { faIdCard };

  @Input() parentForm!: FormGroup;
  @Input() searchMode: 'USER' | 'TUTOR' = 'USER';
  @Output() onUserFound = new EventEmitter<any>();
  @Output() onUserNotFound = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  lookForEmail() {
    const emailCtrl = this.parentForm.get('email');
    if (!emailCtrl || !emailCtrl.valid) return;

    const email = emailCtrl.value;

    if (this.searchMode === 'USER') {
      this.userService.findByEmail(email).pipe(catchError(() => of(null))).subscribe({
        next: (user: any) => {
          if (user && !user.error) {
            const userObj = new User(user);
            emailCtrl.setErrors(null);
            this.onUserFound.emit({ user: userObj, rawData: user });
          } else {
            emailCtrl.setErrors({ userNotFound: true });
            this.onUserNotFound.emit();
          }
        }
      });
    } else if (this.searchMode === 'TUTOR') {
      this.http.get(`${URL_API}/api/tutor/search/findByUserEmail?email=${email}`).pipe(catchError(() => of(null))).subscribe({
        next: (tutor: any) => {
          if (tutor && !tutor.error) {
             emailCtrl.setErrors(null);
             this.userService.findByEmail(email).pipe(catchError(() => of(null))).subscribe({
               next: (user: any) => {
                 this.onUserFound.emit({ tutor: tutor, user: user });
               }
             });
          } else {
             emailCtrl.setErrors({ notTutor: true });
             this.onUserNotFound.emit();
          }
        }
      });
    }
  }

  isValid(ctrl: AbstractControl<any, any>) {
    if (ctrl.touched && ctrl.valid) return true;
    else if (ctrl.touched && ctrl.invalid) return false;
    else return undefined;
  }
}
