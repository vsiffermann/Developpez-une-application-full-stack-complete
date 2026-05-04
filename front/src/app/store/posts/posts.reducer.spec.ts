import { PostsActions } from './posts.actions';
import { postsReducer, PostsState } from './posts.reducer';
import { Post, PostDetail } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';

const mockPost: Post = {
  id: 1,
  title: 'Article Test',
  content: 'Contenu test',
  authorUsername: 'alice',
  topicName: 'Java',
  createdAt: '2026-05-01T10:00:00Z',
};

const mockComment: Comment = {
  id: 1,
  content: 'Super article',
  authorUsername: 'bob',
  createdAt: '2026-05-01T11:00:00Z',
};

const mockPostDetail: PostDetail = { ...mockPost, comments: [mockComment] };

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  sortOrder: 'desc',
};

describe('PostsReducer', () => {
  describe('loadFeed', () => {
    it('should set loading=true', () => {
      const state = postsReducer(initialState, PostsActions.loadFeed({ sort: 'desc' }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should populate posts on success', () => {
      const state = postsReducer(
        initialState,
        PostsActions.loadFeedSuccess({ posts: [mockPost] })
      );
      expect(state.posts).toHaveLength(1);
      expect(state.posts[0]).toEqual(mockPost);
      expect(state.loading).toBe(false);
    });

    it('should set error on failure', () => {
      const state = postsReducer(
        { ...initialState, loading: true },
        PostsActions.loadFeedFailure({ error: 'Erreur réseau' })
      );
      expect(state.error).toBe('Erreur réseau');
      expect(state.loading).toBe(false);
    });
  });

  describe('setSortOrder', () => {
    it('should update sortOrder to asc', () => {
      const state = postsReducer(initialState, PostsActions.setSortOrder({ sort: 'asc' }));
      expect(state.sortOrder).toBe('asc');
    });
  });

  describe('createPost', () => {
    it('should prepend new post to list on success', () => {
      const existingPost: Post = { ...mockPost, id: 2, title: 'Post existant' };
      const newPost: Post = { ...mockPost, id: 3, title: 'Nouveau post' };
      const state = postsReducer(
        { ...initialState, posts: [existingPost] },
        PostsActions.createPostSuccess({ post: newPost })
      );
      expect(state.posts).toHaveLength(2);
      expect(state.posts[0]).toEqual(newPost);
    });
  });

  describe('loadPost', () => {
    it('should reset currentPost and set loading=true', () => {
      const state = postsReducer(
        { ...initialState, currentPost: mockPostDetail },
        PostsActions.loadPost({ id: 1 })
      );
      expect(state.currentPost).toBeNull();
      expect(state.loading).toBe(true);
    });

    it('should set currentPost on success', () => {
      const state = postsReducer(
        initialState,
        PostsActions.loadPostSuccess({ post: mockPostDetail })
      );
      expect(state.currentPost).toEqual(mockPostDetail);
      expect(state.loading).toBe(false);
    });
  });

  describe('addComment', () => {
    it('should append comment to currentPost.comments on success', () => {
      const newComment: Comment = {
        id: 2,
        content: 'Nouveau commentaire',
        authorUsername: 'charlie',
        createdAt: '2026-05-01T12:00:00Z',
      };
      const state = postsReducer(
        { ...initialState, currentPost: mockPostDetail },
        PostsActions.addCommentSuccess({ comment: newComment })
      );
      expect(state.currentPost!.comments).toHaveLength(2);
      expect(state.currentPost!.comments[1]).toEqual(newComment);
    });

    it('should not crash if currentPost is null', () => {
      const newComment: Comment = {
        id: 2,
        content: 'Commentaire',
        authorUsername: 'dave',
        createdAt: '2026-05-01T12:00:00Z',
      };
      const state = postsReducer(
        initialState,
        PostsActions.addCommentSuccess({ comment: newComment })
      );
      expect(state.currentPost).toBeNull();
    });
  });
});
