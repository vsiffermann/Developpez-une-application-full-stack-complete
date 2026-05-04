import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { AuthActions } from '../../store/auth/auth.actions';
import { TopicsActions } from '../../store/topics/topics.actions';

const mockUser = { id: 1, email: 'alice@test.com', username: 'alice' };

const storeInitialState = {
  auth: { user: mockUser, token: 'jwt', isAuthenticated: true, loading: false, error: null },
  topics: { topics: [], loading: false, error: null },
};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: storeInitialState }),
      ],
    })
      .overrideComponent(ProfileComponent, {
        set: { imports: [ReactiveFormsModule, AsyncPipe], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTopics on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(TopicsActions.loadTopics());
  });

  it('should pre-fill the form with current user data', () => {
    expect(component.form.value.email).toBe('alice@test.com');
    expect(component.form.value.username).toBe('alice');
  });

  it('should dispatch updateProfile on submit with changed fields', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.patchValue({ username: 'newname' });
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.updateProfile({ email: 'alice@test.com', username: 'newname' })
    );
  });

  it('should not dispatch if form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.controls.email.setValue('not-an-email');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch logout on logout()', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.logout();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });

  it('should dispatch unsubscribe on unsubscribe()', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.unsubscribe(2);
    expect(dispatchSpy).toHaveBeenCalledWith(TopicsActions.unsubscribe({ id: 2 }));
  });
});
