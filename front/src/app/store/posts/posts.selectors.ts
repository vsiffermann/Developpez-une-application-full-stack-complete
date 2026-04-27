import { postsFeature } from './posts.reducer';

export const selectFeed = postsFeature.selectPosts;
export const selectCurrentPost = postsFeature.selectCurrentPost;
export const selectPostsLoading = postsFeature.selectLoading;
export const selectSortOrder = postsFeature.selectSortOrder;
export const selectPostsError = postsFeature.selectError;
