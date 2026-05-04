import { selectTopics, selectTopicsLoading, selectTopicsError } from './topics.selectors';
import { TopicsState } from './topics.reducer';
import { Topic } from '../../shared/models/topic.model';

const mockTopics: Topic[] = [
  { id: 1, name: 'Java', description: 'Java lang', subscribed: false },
  { id: 2, name: 'JavaScript', description: 'JS lang', subscribed: true },
];

const state = (topics: Partial<TopicsState>) => ({
  topics: {
    topics: [],
    loading: false,
    error: null,
    ...topics,
  } as TopicsState,
});

describe('TopicsSelectors', () => {
  it('selectTopics should return topics list', () => {
    expect(selectTopics(state({ topics: mockTopics }))).toEqual(mockTopics);
  });

  it('selectTopicsLoading should return loading state', () => {
    expect(selectTopicsLoading(state({ loading: true }))).toBe(true);
  });

  it('selectTopicsError should return the error', () => {
    expect(selectTopicsError(state({ error: 'Erreur' }))).toBe('Erreur');
  });
});
