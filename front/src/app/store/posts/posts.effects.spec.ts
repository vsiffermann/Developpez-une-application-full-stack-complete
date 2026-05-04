import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { PostsActions } from './posts.actions';
import * as PostsEffects from './posts.effects';

const mockRouter = { navigate: jest.fn().mockResolvedValue(true) };
import { Post, PostDetail } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';

const mockPost: Post = { id: 1, title: 'Article', content: 'body', authorUsername: 'alice', topicName: 'Java', createdAt: '2026-01-01' };
const mockDetail: PostDetail = { ...mockPost, comments: [] };
const mockComment: Comment = { id: 1, content: 'Super!', authorUsername: 'bob', createdAt: '2026-01-01' };

describe('PostsEffects', () => {
  let actions$: Observable<Action>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('loadFeedEffect', () => {
    it('should dispatch loadFeedSuccess on success', (done) => {
      actions$ = of(PostsActions.loadFeed({ sort: 'desc' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.loadFeedEffect().subscribe((action) => {
          expect(action).toEqual(PostsActions.loadFeedSuccess({ posts: [mockPost] }));
          done();
        });
      });
      httpController.expectOne('/api/posts/feed?sort=desc').flush([mockPost]);
    });

    it('should dispatch loadFeedFailure on error', (done) => {
      actions$ = of(PostsActions.loadFeed({ sort: 'asc' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.loadFeedEffect().subscribe((action) => {
          expect(action.type).toBe(PostsActions.loadFeedFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/posts/feed?sort=asc').flush('error', { status: 500, statusText: 'Error' });
    });
  });

  describe('setSortOrderEffect', () => {
    it('should dispatch loadFeed when sort order changes', (done) => {
      actions$ = of(PostsActions.setSortOrder({ sort: 'asc' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.setSortOrderEffect().subscribe((action) => {
          expect(action).toEqual(PostsActions.loadFeed({ sort: 'asc' }));
          done();
        });
      });
    });
  });

  describe('createPostEffect', () => {
    it('should dispatch createPostSuccess on success', (done) => {
      actions$ = of(PostsActions.createPost({ topicId: 1, title: 'Article', content: 'body' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.createPostEffect().subscribe((action) => {
          expect(action).toEqual(PostsActions.createPostSuccess({ post: mockPost }));
          done();
        });
      });
      httpController.expectOne('/api/posts').flush(mockPost);
    });

    it('should dispatch createPostFailure on error', (done) => {
      actions$ = of(PostsActions.createPost({ topicId: 1, title: 'Article', content: 'body' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.createPostEffect().subscribe((action) => {
          expect(action.type).toBe(PostsActions.createPostFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/posts').flush('error', { status: 500, statusText: 'Error' });
    });
  });

  describe('loadPostEffect', () => {
    it('should dispatch loadPostSuccess on success', (done) => {
      actions$ = of(PostsActions.loadPost({ id: 1 }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.loadPostEffect().subscribe((action) => {
          expect(action).toEqual(PostsActions.loadPostSuccess({ post: mockDetail }));
          done();
        });
      });
      httpController.expectOne('/api/posts/1').flush(mockDetail);
    });

    it('should dispatch loadPostFailure on error', (done) => {
      actions$ = of(PostsActions.loadPost({ id: 999 }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.loadPostEffect().subscribe((action) => {
          expect(action.type).toBe(PostsActions.loadPostFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/posts/999').flush('error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addCommentEffect', () => {
    it('should dispatch addCommentSuccess on success', (done) => {
      actions$ = of(PostsActions.addComment({ postId: 1, content: 'Super!' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.addCommentEffect().subscribe((action) => {
          expect(action).toEqual(PostsActions.addCommentSuccess({ comment: mockComment }));
          done();
        });
      });
      httpController.expectOne('/api/posts/1/comments').flush(mockComment);
    });

    it('should dispatch addCommentFailure on error', (done) => {
      actions$ = of(PostsActions.addComment({ postId: 1, content: '' }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.addCommentEffect().subscribe((action) => {
          expect(action.type).toBe(PostsActions.addCommentFailure.type);
          done();
        });
      });
      httpController.expectOne('/api/posts/1/comments').flush('error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createPostSuccessEffect', () => {
    it('should navigate to post detail after create success', (done) => {
      actions$ = of(PostsActions.createPostSuccess({ post: mockPost }));
      TestBed.runInInjectionContext(() => {
        PostsEffects.createPostSuccessEffect().subscribe(() => {
          done();
        });
      });
    });
  });
});
