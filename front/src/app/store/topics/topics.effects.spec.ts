import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TopicsActions } from './topics.actions';
import * as TopicsEffects from './topics.effects';
import { Topic } from '../../shared/models/topic.model';

const mockTopics: Topic[] = [
  { id: 1, name: 'Java', description: 'Java lang', subscribed: false },
  { id: 2, name: 'JavaScript', description: 'JS lang', subscribed: true },
];

describe('TopicsEffects', () => {
  let actions$: Observable<Action>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('loadTopicsEffect', () => {
    it('should dispatch loadTopicsSuccess on success', (done) => {
      actions$ = of(TopicsActions.loadTopics());
      TestBed.runInInjectionContext(() => {
        TopicsEffects.loadTopicsEffect().subscribe((action) => {
          expect(action).toEqual(TopicsActions.loadTopicsSuccess({ topics: mockTopics }));
          done();
        });
      });
      httpController.expectOne('/api/topics').flush(mockTopics);
    });

    it('should dispatch loadTopicsFailure on error', (done) => {
      actions$ = of(TopicsActions.loadTopics());
      TestBed.runInInjectionContext(() => {
        TopicsEffects.loadTopicsEffect().subscribe((action) => {
          expect(action.type).toBe(TopicsActions.loadTopicsFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/topics').flush('error', { status: 500, statusText: 'Error' });
    });
  });

  describe('subscribeEffect', () => {
    it('should dispatch subscribeSuccess on success', (done) => {
      actions$ = of(TopicsActions.subscribe({ id: 1 }));
      TestBed.runInInjectionContext(() => {
        TopicsEffects.subscribeEffect().subscribe((action) => {
          expect(action).toEqual(TopicsActions.subscribeSuccess({ id: 1 }));
          done();
        });
      });
      httpController.expectOne('/api/topics/1/subscribe').flush(null);
    });

    it('should dispatch loadTopicsFailure on subscribe error', (done) => {
      actions$ = of(TopicsActions.subscribe({ id: 999 }));
      TestBed.runInInjectionContext(() => {
        TopicsEffects.subscribeEffect().subscribe((action) => {
          expect(action.type).toBe(TopicsActions.loadTopicsFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/topics/999/subscribe').flush('error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('unsubscribeEffect', () => {
    it('should dispatch unsubscribeSuccess on success', (done) => {
      actions$ = of(TopicsActions.unsubscribe({ id: 2 }));
      TestBed.runInInjectionContext(() => {
        TopicsEffects.unsubscribeEffect().subscribe((action) => {
          expect(action).toEqual(TopicsActions.unsubscribeSuccess({ id: 2 }));
          done();
        });
      });
      httpController.expectOne('/api/topics/2/subscribe').flush(null);
    });

    it('should dispatch loadTopicsFailure on unsubscribe error', (done) => {
      actions$ = of(TopicsActions.unsubscribe({ id: 999 }));
      TestBed.runInInjectionContext(() => {
        TopicsEffects.unsubscribeEffect().subscribe((action) => {
          expect(action.type).toBe(TopicsActions.loadTopicsFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/topics/999/subscribe').flush('error', { status: 404, statusText: 'Not Found' });
    });
  });
});
