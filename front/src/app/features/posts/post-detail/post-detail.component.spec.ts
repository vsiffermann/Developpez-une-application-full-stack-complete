import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostDetailComponent } from './post-detail.component';
import { PostsActions } from '../../../store/posts/posts.actions';

const mockPost = {
  id: 1,
  title: 'Article Test',
  content: 'Contenu test',
  authorUsername: 'alice',
  topicName: 'Java',
  createdAt: '2026-01-01T10:00:00Z',
  comments: [{ id: 1, content: 'Super!', authorUsername: 'bob', createdAt: '2026-01-01T11:00:00Z' }],
};

const storeInitialState = {
  posts: { posts: [], currentPost: mockPost, loading: false, error: null, sortOrder: 'desc' },
};

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let store: MockStore;
  let locationSpy: { back: jest.Mock };

  beforeEach(async () => {
    locationSpy = { back: jest.fn() };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: storeInitialState }),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Location, useValue: locationSpy },
      ],
    })
      .overrideComponent(PostDetailComponent, {
        set: { imports: [ReactiveFormsModule, AsyncPipe, DatePipe], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadPost on init with route param id', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(PostsActions.loadPost({ id: 1 }));
  });

  it('should call location.back() on goBack()', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should not dispatch addComment if control is empty', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.commentControl.setValue('');
    component.submitComment();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch addComment and reset control on valid submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.commentControl.setValue('Super article!');
    component.submitComment();
    expect(dispatchSpy).toHaveBeenCalledWith(
      PostsActions.addComment({ postId: 1, content: 'Super article!' })
    );
    expect(component.commentControl.value).toBeNull();
  });
});
