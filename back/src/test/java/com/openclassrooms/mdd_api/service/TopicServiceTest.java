package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.SubscriptionRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock private TopicRepository topicRepository;
    @Mock private SubscriptionRepository subscriptionRepository;
    @InjectMocks private TopicService topicService;

    // --- getAll ---

    @Test
    void getAll_returnsTopicsWithSubscribedFlag() {
        // given 3 topics exist and the user is subscribed to one of them, when getAll is called, then the matching topic has subscribed=true and the others have subscribed=false
    }

    @Test
    void getAll_noSubscriptions_allFlagsAreFalse() {
        // given topics exist but the user has no subscriptions, when getAll is called, then all returned topics have subscribed=false
    }

    // --- subscribe ---

    @Test
    void subscribe_success_savesSubscription() {
        // given the topic exists and the user is not yet subscribed, when subscribe is called, then subscriptionRepository.save is called with the correct user and topic
    }

    @Test
    void subscribe_topicNotFound_throwsNotFound() {
        // given topicRepository.findById returns empty, when subscribe is called, then a ResponseStatusException with status 404 is thrown
    }

    @Test
    void subscribe_alreadySubscribed_throwsConflict() {
        // given the topic exists and existsByUserAndTopic returns true, when subscribe is called, then a ResponseStatusException with status 409 is thrown
    }

    // --- unsubscribe ---

    @Test
    void unsubscribe_success_deletesSubscription() {
        // given the topic exists and the user has an active subscription, when unsubscribe is called, then subscriptionRepository.delete is called with the correct subscription
    }

    @Test
    void unsubscribe_topicNotFound_throwsNotFound() {
        // given topicRepository.findById returns empty, when unsubscribe is called, then a ResponseStatusException with status 404 is thrown
    }

    @Test
    void unsubscribe_notSubscribed_throwsNotFound() {
        // given the topic exists but findByUserAndTopic returns empty, when unsubscribe is called, then a ResponseStatusException with status 404 is thrown
    }
}
