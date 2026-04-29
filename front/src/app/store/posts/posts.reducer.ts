import { createFeature, createReducer, on } from '@ngrx/store';
import { Post, PostDetail } from '../../shared/models/post.model';
import { PostsActions } from './posts.actions';

export type SortOrder = 'asc' | 'desc';

export interface PostsState {
  posts: Post[];
  currentPost: PostDetail | null;
  loading: boolean;
  error: string | null;
  sortOrder: SortOrder;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  sortOrder: 'desc',
};

export const postsFeature = createFeature({
  name: 'posts',
  reducer: createReducer(
    initialState,
    on(PostsActions.loadFeed, (state) => ({ ...state, loading: true, error: null })),
    on(PostsActions.loadFeedSuccess, (state, { posts }) => ({ ...state, posts, loading: false })),
    on(PostsActions.loadFeedFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(PostsActions.setSortOrder, (state, { sort }) => ({ ...state, sortOrder: sort })),
    on(PostsActions.createPost, (state) => ({ ...state, loading: true, error: null })),
    on(PostsActions.createPostSuccess, (state, { post }) => ({
      ...state,
      posts: [post, ...state.posts],
      loading: false,
    })),
    on(PostsActions.createPostFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(PostsActions.loadPost, (state) => ({ ...state, loading: true, error: null, currentPost: null })),
    on(PostsActions.loadPostSuccess, (state, { post }) => ({ ...state, currentPost: post, loading: false })),
    on(PostsActions.loadPostFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(PostsActions.addComment, (state) => ({ ...state, loading: true })),
    on(PostsActions.addCommentSuccess, (state, { comment }) => ({
      ...state,
      loading: false,
      currentPost: state.currentPost
        ? { ...state.currentPost, comments: [...state.currentPost.comments, comment] }
        : null,
    })),
    on(PostsActions.addCommentFailure, (state, { error }) => ({ ...state, error, loading: false })),
  ),
});

export const postsReducer = postsFeature.reducer;
