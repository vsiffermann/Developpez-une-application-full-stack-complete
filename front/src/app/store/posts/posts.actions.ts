import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post } from '../../shared/models/post.model';

export const PostsActions = createActionGroup({
  source: 'Posts',
  events: {
    'Load Feed': emptyProps(),
    'Load Feed Success': props<{ posts: Post[] }>(),
    'Load Feed Failure': props<{ error: string }>(),
    'Create Post': props<{ title: string; content: string; topicId: number }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Load Post': props<{ id: number }>(),
    'Load Post Success': props<{ post: Post }>(),
  },
});
