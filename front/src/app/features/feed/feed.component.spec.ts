import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FeedComponent } from './feed.component';
import { PostsActions } from '../../store/posts/posts.actions';

const mockPosts = [
  { id: 1, title: 'Article 1', content: '...', authorUsername: 'alice', topicName: 'Java', createdAt: new Date().toISOString() },
  { id: 2, title: 'Article 2', content: '...', authorUsername: 'bob', topicName: 'JS', createdAt: new Date().toISOString() },
];

const storeInitialState = {
  posts: { posts: mockPosts, loading: false, error: null, sortOrder: 'desc' },
  auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null },
};

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: storeInitialState }),
      ],
    })
      .overrideComponent(FeedComponent, { set: { imports: [AsyncPipe, DatePipe, SlicePipe, RouterLink], schemas: [NO_ERRORS_SCHEMA] } })
      .compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadFeed on init', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(PostsActions.loadFeed({ sort: 'desc' }));
  });

  it('should dispatch setSortOrder when toggling from desc', () => {
    dispatchSpy.mockClear();
    component.toggleSort('desc');
    expect(dispatchSpy).toHaveBeenCalledWith(PostsActions.setSortOrder({ sort: 'asc' }));
  });

  it('should dispatch setSortOrder when toggling from asc', () => {
    dispatchSpy.mockClear();
    component.toggleSort('asc');
    expect(dispatchSpy).toHaveBeenCalledWith(PostsActions.setSortOrder({ sort: 'desc' }));
  });
});
