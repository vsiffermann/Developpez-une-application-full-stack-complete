import { PostsActions } from './posts.actions';
import { postsReducer, PostsState } from './posts.reducer';

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
      // TODO: dispatch PostsActions.loadFeed
    });

    it('should populate posts on success', () => {
      // TODO: dispatch PostsActions.loadFeedSuccess({ posts: [...] }), then expect state.posts rempli
    });

    it('should set error on failure', () => {
      // TODO: dispatch PostsActions.loadFeedFailure
    });
  });

  describe('setSortOrder', () => {
    it('should update sortOrder to asc', () => {
      // TODO: dispatch PostsActions.setSortOrder({ sort: 'asc' }), then expect sortOrder='asc'
    });
  });

  describe('createPost', () => {
    it('should prepend new post to list on success', () => {
      // TODO: partir d'un état avec 1 post, dispatch createPostSuccess, then expect 2 posts avec le nouveau en premier
    });
  });

  describe('loadPost', () => {
    it('should reset currentPost and set loading=true', () => {
      // TODO: dispatch PostsActions.loadPost, then expect currentPost=null et loading=true
    });

    it('should set currentPost on success', () => {
      // TODO: dispatch PostsActions.loadPostSuccess({ post }), then expect currentPost défini
    });
  });

  describe('addComment', () => {
    it('should append comment to currentPost.comments on success', () => {
      // TODO: partir d'un état avec currentPost, dispatch addCommentSuccess, then expect comments.length augmenté
    });

    it('should not crash if currentPost is null', () => {
      // TODO: dispatch addCommentSuccess avec currentPost=null, then expect currentPost reste null
    });
  });
});
