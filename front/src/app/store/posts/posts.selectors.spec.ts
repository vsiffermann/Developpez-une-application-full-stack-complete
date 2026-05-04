import { selectFeed, selectCurrentPost, selectPostsLoading, selectSortOrder, selectPostsError } from './posts.selectors';
import { PostsState } from './posts.reducer';
import { Post, PostDetail } from '../../shared/models/post.model';

const mockPost: Post = { id: 1, title: 'Article', content: 'body', authorUsername: 'alice', topicName: 'Java', createdAt: '2026-01-01' };
const mockDetail: PostDetail = { ...mockPost, comments: [] };

const state = (posts: Partial<PostsState>) => ({
  posts: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    sortOrder: 'desc' as const,
    ...posts,
  } as PostsState,
});

describe('PostsSelectors', () => {
  it('selectFeed should return posts list', () => {
    expect(selectFeed(state({ posts: [mockPost] }))).toEqual([mockPost]);
  });

  it('selectCurrentPost should return the current post', () => {
    expect(selectCurrentPost(state({ currentPost: mockDetail }))).toEqual(mockDetail);
  });

  it('selectPostsLoading should return loading state', () => {
    expect(selectPostsLoading(state({ loading: true }))).toBe(true);
  });

  it('selectSortOrder should return the sort order', () => {
    expect(selectSortOrder(state({ sortOrder: 'asc' }))).toBe('asc');
  });

  it('selectPostsError should return the error', () => {
    expect(selectPostsError(state({ error: 'Erreur réseau' }))).toBe('Erreur réseau');
  });
});
