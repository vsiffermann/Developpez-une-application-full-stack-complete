import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncPipe } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TopicsComponent } from './topics.component';
import { TopicsActions } from '../../store/topics/topics.actions';

const mockTopics = [
  { id: 1, name: 'Java', description: 'Java lang', subscribed: false },
  { id: 2, name: 'JavaScript', description: 'JS lang', subscribed: true },
];

const storeInitialState = {
  topics: { topics: mockTopics, loading: false, error: null },
};

describe('TopicsComponent', () => {
  let component: TopicsComponent;
  let fixture: ComponentFixture<TopicsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: storeInitialState }),
      ],
    })
      .overrideComponent(TopicsComponent, { set: { imports: [AsyncPipe], schemas: [NO_ERRORS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
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

  it('should dispatch subscribe action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.subscribe(1);
    expect(dispatchSpy).toHaveBeenCalledWith(TopicsActions.subscribe({ id: 1 }));
  });

  it('should dispatch unsubscribe action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.unsubscribe(2);
    expect(dispatchSpy).toHaveBeenCalledWith(TopicsActions.unsubscribe({ id: 2 }));
  });
});
