import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { AuthActions } from '../../../store/auth/auth.actions';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore(),
      ],
    })
      .overrideComponent(NavbarComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch logout on logout()', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.logout();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });
});
