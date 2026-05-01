import { TopicsActions } from './topics.actions';
import { topicsReducer, TopicsState } from './topics.reducer';

const initialState: TopicsState = {
  topics: [],
  loading: false,
  error: null,
};

describe('TopicsReducer', () => {
  describe('loadTopics', () => {
    it('should set loading=true', () => {
      // TODO: dispatch TopicsActions.loadTopics
    });

    it('should populate topics on success', () => {
      // TODO: dispatch TopicsActions.loadTopicsSuccess({ topics: [...] }), then expect state.topics rempli
    });

    it('should set error on failure', () => {
      // TODO: dispatch TopicsActions.loadTopicsFailure({ error: 'message' })
    });
  });

  describe('subscribe', () => {
    it('should mark topic as subscribed on success', () => {
      // TODO: partir d'un état avec topics dont id=1 subscribed=false,
      //       dispatch subscribeSuccess({ id: 1 }), then expect topics[id=1].subscribed=true
    });

    it('should not affect other topics', () => {
      // TODO: vérifier que les autres topics restent inchangés
    });
  });

  describe('unsubscribe', () => {
    it('should mark topic as unsubscribed on success', () => {
      // TODO: partir d'un état avec topics dont id=1 subscribed=true,
      //       dispatch unsubscribeSuccess({ id: 1 }), then expect topics[id=1].subscribed=false
    });
  });
});
