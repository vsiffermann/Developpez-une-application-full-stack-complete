import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, Location } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CreatePostComponent } from './create-post.component';
import { PostsActions } from '../../../store/posts/posts.actions';
import { TopicsActions } from '../../../store/topics/topics.actions';

const mockTopics = [
  { id: 1, name: 'Java', description: 'Java lang', subscribed: true },
];

const storeInitialState = {
  posts: { posts: [], currentPost: null, loading: false, error: null, sortOrder: 'desc' },
  topics: { topics: mockTopics, loading: false, error: null },
};

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let store: MockStore;
  let locationSpy: { back: jest.Mock };

  beforeEach(async () => {
    locationSpy = { back: jest.fn() };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState: storeInitialState }),
        { provide: Location, useValue: locationSpy },
      ],
    })
      .overrideComponent(CreatePostComponent, {
        set: { template: '<div></div>', imports: [ReactiveFormsModule], schemas: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
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

  it('should have an invalid form when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should have a valid form when all fields are filled', () => {
    component.form.setValue({ topicId: 1, title: 'Mon article', content: 'Du contenu' });
    expect(component.form.valid).toBe(true);
  });

  it('should call location.back() on goBack()', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should dispatch createPost on valid submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.setValue({ topicId: 1, title: 'Mon article', content: 'Du contenu' });
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      PostsActions.createPost({ topicId: 1, title: 'Mon article', content: 'Du contenu' })
    );
  });

  it('should not dispatch if form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
