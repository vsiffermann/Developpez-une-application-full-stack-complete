import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Topic } from '../../shared/models/topic.model';

export const TopicsActions = createActionGroup({
  source: 'Topics',
  events: {
    'Load Topics': emptyProps(),
    'Load Topics Success': props<{ topics: Topic[] }>(),
    'Load Topics Failure': props<{ error: string }>(),
    'Subscribe': props<{ id: number }>(),
    'Subscribe Success': props<{ id: number }>(),
    'Unsubscribe': props<{ id: number }>(),
    'Unsubscribe Success': props<{ id: number }>(),
  },
});
