import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RegisterComponent } from './register.component';
import { AuthActions } from '../../../store/auth/auth.actions';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: { auth: { loading: false, error: null } } }),
      ],
    })
      .overrideComponent(RegisterComponent, { set: { imports: [ReactiveFormsModule, AsyncPipe], schemas: [NO_ERRORS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should have a valid form with all fields correctly filled', () => {
    component.form.setValue({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' });
    expect(component.form.valid).toBe(true);
  });

  it('should mark email field invalid with bad email', () => {
    component.form.controls.email.setValue('not-an-email');
    expect(component.form.controls.email.invalid).toBe(true);
  });

  it('should mark password invalid if it does not match regex', () => {
    component.form.controls.password.setValue('password');
    expect(component.form.controls.password.invalid).toBe(true);
  });

  it('should compute password criteria correctly', () => {
    component.form.controls.password.setValue('P@ssw0rd1');
    const criteria = component.passwordCriteria();
    expect(criteria.every((c) => c.valid)).toBe(true);
  });

  it('should dispatch AuthActions.register on valid submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.setValue({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' });
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.register({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' })
    );
  });

  it('should not dispatch if form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
