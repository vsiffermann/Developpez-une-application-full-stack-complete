import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post, PostDetail } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';

export const PostsActions = createActionGroup({
  source: 'Posts',
  events: {
    'Load Feed': props<{ sort: 'asc' | 'desc' }>(),
    'Load Feed Success': props<{ posts: Post[] }>(),
    'Load Feed Failure': props<{ error: string }>(),
    'Set Sort Order': props<{ sort: 'asc' | 'desc' }>(),
    'Create Post': props<{ title: string; content: string; topicId: number }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Create Post Failure': props<{ error: string }>(),
    'Load Post': props<{ id: number }>(),
    'Load Post Success': props<{ post: PostDetail }>(),
    'Load Post Failure': props<{ error: string }>(),
    'Add Comment': props<{ postId: number; content: string }>(),
    'Add Comment Success': props<{ comment: Comment }>(),
    'Add Comment Failure': props<{ error: string }>(),
  },
});
