import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthActions } from '../../../store/auth/auth.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: { auth: { loading: false, error: null } } }),
      ],
    })
      .overrideComponent(LoginComponent, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should have a valid form with identifier and password', () => {
    component.form.setValue({ identifier: 'alice@test.com', password: 'P@ssw0rd1' });
    expect(component.form.valid).toBe(true);
  });

  it('should dispatch AuthActions.login on submit with valid form', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.setValue({ identifier: 'alice@test.com', password: 'P@ssw0rd1' });
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({ identifier: 'alice@test.com', password: 'P@ssw0rd1' })
    );
  });

  it('should not dispatch if form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});