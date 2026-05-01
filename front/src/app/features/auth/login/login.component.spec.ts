import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthActions } from '../../../store/auth/auth.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { auth: { loading: false, error: null } } })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    // TODO: expect(component).toBeTruthy()
  });

  it('should have an invalid form when empty', () => {
    // TODO: expect(component.form.invalid).toBe(true)
  });

  it('should have a valid form with identifier and password', () => {
    // TODO: remplir form.controls['identifier'] et 'password', then expect form.valid=true
  });

  it('should dispatch AuthActions.login on submit with valid form', () => {
    // TODO: remplir le formulaire, appeler onSubmit(), then expect store.dispatch appelé avec AuthActions.login
  });

  it('should not dispatch if form is invalid', () => {
    // TODO: appeler onSubmit() sans remplir le formulaire, then expect dispatch non appelé
  });
});
