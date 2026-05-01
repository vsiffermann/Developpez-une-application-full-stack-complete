import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FeedComponent } from './feed.component';
import { PostsActions } from '../../store/posts/posts.actions';

const mockPosts = [
  { id: 1, title: 'Article 1', content: '...', authorUsername: 'alice', topicName: 'Java', createdAt: new Date().toISOString() },
  { id: 2, title: 'Article 2', content: '...', authorUsername: 'bob', topicName: 'JS', createdAt: new Date().toISOString() },
];

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore({
          initialState: { posts: { posts: mockPosts, loading: false, error: null, sortOrder: 'desc' } },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    // TODO: expect(component).toBeTruthy()
  });

  it('should dispatch loadFeed on init', () => {
    // TODO: expect store.dispatch appelé avec PostsActions.loadFeed()
  });

  it('should display posts from the store', () => {
    // TODO: expect le template à afficher 2 cartes d'articles
  });

  it('should display empty state when no posts', () => {
    // TODO: override store state avec posts=[], then expect message "Aucun article"
  });

  it('should dispatch setSortOrder and reload on sort change', () => {
    // TODO: appeler la méthode de tri avec 'asc', then expect 2 dispatchs : setSortOrder + loadFeed
  });
});
