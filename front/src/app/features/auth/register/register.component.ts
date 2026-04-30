import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

const SPECIAL_CHARS = '@$!%*?&#';
const PASSWORD_PATTERN = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${SPECIAL_CHARS}]).{8,}$`);

class PasswordCriteriaErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    LogoComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly store = inject(Store);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);

  readonly showPassword = signal(false);
  readonly passwordErrorMatcher = new PasswordCriteriaErrorMatcher();

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
  });

  private readonly passwordValue = toSignal(
    this.form.controls.password.valueChanges,
    { initialValue: '' },
  );

  readonly passwordCriteria = computed(() => {
    const pwd = this.passwordValue() ?? '';
    return [
      { label: '8 caractères minimum', valid: pwd.length >= 8 },
      { label: 'Une majuscule', valid: /[A-Z]/.test(pwd) },
      { label: 'Une minuscule', valid: /[a-z]/.test(pwd) },
      { label: 'Un chiffre', valid: /\d/.test(pwd) },
      { label: `Un caractère spécial (${SPECIAL_CHARS})`, valid: new RegExp(`[${SPECIAL_CHARS}]`).test(pwd) },
    ];
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, username, password } = this.form.value;
    this.store.dispatch(AuthActions.register({ email: email!, username: username!, password: password! }));
  }
}
