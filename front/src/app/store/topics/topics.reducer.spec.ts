import { TopicsActions } from './topics.actions';
import { topicsReducer, TopicsState } from './topics.reducer';
import { Topic } from '../../shared/models/topic.model';

const mockTopics: Topic[] = [
  { id: 1, name: 'Java', description: 'Le langage Java', subscribed: false },
  { id: 2, name: 'JavaScript', description: 'Le langage JS', subscribed: true },
];

const initialState: TopicsState = {
  topics: [],
  loading: false,
  error: null,
};

describe('TopicsReducer', () => {
  describe('loadTopics', () => {
    it('should set loading=true', () => {
      const state = topicsReducer(initialState, TopicsActions.loadTopics());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should populate topics on success', () => {
      const state = topicsReducer(
        initialState,
        TopicsActions.loadTopicsSuccess({ topics: mockTopics })
      );
      expect(state.topics).toHaveLength(2);
      expect(state.topics).toEqual(mockTopics);
      expect(state.loading).toBe(false);
    });

    it('should set error on failure', () => {
      const state = topicsReducer(
        { ...initialState, loading: true },
        TopicsActions.loadTopicsFailure({ error: 'Erreur réseau' })
      );
      expect(state.error).toBe('Erreur réseau');
      expect(state.loading).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should mark topic as subscribed on success', () => {
      const state = topicsReducer(
        { ...initialState, topics: mockTopics },
        TopicsActions.subscribeSuccess({ id: 1 })
      );
      expect(state.topics.find((t) => t.id === 1)!.subscribed).toBe(true);
    });

    it('should not affect other topics', () => {
      const state = topicsReducer(
        { ...initialState, topics: mockTopics },
        TopicsActions.subscribeSuccess({ id: 1 })
      );
      // id=2 was already subscribed=true, subscribing id=1 must not change it
      expect(state.topics.find((t) => t.id === 2)!.subscribed).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    it('should mark topic as unsubscribed on success', () => {
      const state = topicsReducer(
        { ...initialState, topics: mockTopics },
        TopicsActions.unsubscribeSuccess({ id: 2 })
      );
      expect(state.topics.find((t) => t.id === 2)!.subscribed).toBe(false);
    });
  });
});
