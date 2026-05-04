import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { auth: { isAuthenticated: false } } }),
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('should allow access when authenticated', (done) => {
    store.setState({ auth: { isAuthenticated: true } });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean | UrlTree>;
      result.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });
  });

  it('should redirect to /login when not authenticated', (done) => {
    store.setState({ auth: { isAuthenticated: false } });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean | UrlTree>;
      result.subscribe((value) => {
        expect(value).toBeInstanceOf(UrlTree);
        expect((value as UrlTree).toString()).toBe('/login');
        done();
      });
    });
  });
});
