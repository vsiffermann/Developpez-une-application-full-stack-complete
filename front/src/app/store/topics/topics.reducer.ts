import { createFeature, createReducer, on } from '@ngrx/store';
import { Topic } from '../../shared/models/topic.model';
import { TopicsActions } from './topics.actions';

export interface TopicsState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const initialState: TopicsState = {
  topics: [],
  loading: false,
  error: null,
};

export const topicsFeature = createFeature({
  name: 'topics',
  reducer: createReducer(
    initialState,
    on(TopicsActions.loadTopics, (state) => ({ ...state, loading: true, error: null })),
    on(TopicsActions.loadTopicsSuccess, (state, { topics }) => ({
      ...state,
      topics,
      loading: false,
    })),
    on(TopicsActions.loadTopicsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(TopicsActions.subscribe, (state) => ({ ...state, loading: true })),
    on(TopicsActions.subscribeSuccess, (state, { id }) => ({
      ...state,
      loading: false,
      topics: state.topics.map((t) => (t.id === id ? { ...t, subscribed: true } : t)),
    })),
    on(TopicsActions.unsubscribe, (state) => ({ ...state, loading: true })),
    on(TopicsActions.unsubscribeSuccess, (state, { id }) => ({
      ...state,
      loading: false,
      topics: state.topics.map((t) => (t.id === id ? { ...t, subscribed: false } : t)),
    })),
  ),
});

export const topicsReducer = topicsFeature.reducer;
