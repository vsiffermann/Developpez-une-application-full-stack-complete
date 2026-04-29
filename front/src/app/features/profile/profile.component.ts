import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectUser, selectAuthLoading, selectAuthError } from '../../store/auth/auth.selectors';

const SPECIAL_CHARS = '@$!%*?&#';
const PASSWORD_PATTERN = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${SPECIAL_CHARS}]).{8,}$`);

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    NavbarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly store = inject(Store);

  readonly user$ = this.store.select(selectUser);
  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);
  readonly showPassword = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.email]),
    username: new FormControl('', [Validators.minLength(3)]),
    password: new FormControl('', [Validators.pattern(PASSWORD_PATTERN)]),
  });

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.form.patchValue({ email: user.email, username: user.username });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, username, password } = this.form.value;
    const payload: { email?: string; username?: string; password?: string } = {};
    if (email) payload.email = email;
    if (username) payload.username = username;
    if (password) payload.password = password;
    this.store.dispatch(AuthActions.updateProfile(payload));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
