package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.TopicResponse;
import com.openclassrooms.mdd_api.entity.Subscription;
import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.SubscriptionRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock private TopicRepository topicRepository;
    @Mock private SubscriptionRepository subscriptionRepository;
    @InjectMocks private TopicService topicService;

    private final User user = User.builder().id(1L).email("alice@test.com").username("alice").build();

    // --- getAll ---

    @Test
    void getAll_returnsTopicsWithSubscribedFlag() {
        Topic java = Topic.builder().id(1L).name("Java").description("Java").build();
        Topic js   = Topic.builder().id(2L).name("JavaScript").description("JS").build();
        Topic py   = Topic.builder().id(3L).name("Python").description("Python").build();
        Subscription sub = Subscription.builder().id(1L).user(user).topic(java).build();

        when(subscriptionRepository.findByUser(user)).thenReturn(List.of(sub));
        when(topicRepository.findAll()).thenReturn(List.of(java, js, py));

        List<TopicResponse> result = topicService.getAll(user);

        assertThat(result).hasSize(3);
        assertThat(result.stream().filter(t -> t.id().equals(1L)).findFirst().orElseThrow().subscribed()).isTrue();
        assertThat(result.stream().filter(t -> t.id().equals(2L)).findFirst().orElseThrow().subscribed()).isFalse();
        assertThat(result.stream().filter(t -> t.id().equals(3L)).findFirst().orElseThrow().subscribed()).isFalse();
    }

    @Test
    void getAll_noSubscriptions_allFlagsAreFalse() {
        Topic java = Topic.builder().id(1L).name("Java").description("Java").build();

        when(subscriptionRepository.findByUser(user)).thenReturn(List.of());
        when(topicRepository.findAll()).thenReturn(List.of(java));

        List<TopicResponse> result = topicService.getAll(user);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).subscribed()).isFalse();
    }

    // --- subscribe ---

    @Test
    void subscribe_success_savesSubscription() {
        Topic topic = Topic.builder().id(1L).name("Java").build();

        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.existsByUserAndTopic(user, topic)).thenReturn(false);

        topicService.subscribe(user, 1L);

        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void subscribe_topicNotFound_throwsNotFound() {
        when(topicRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> topicService.subscribe(user, 99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void subscribe_alreadySubscribed_throwsConflict() {
        Topic topic = Topic.builder().id(1L).name("Java").build();

        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.existsByUserAndTopic(user, topic)).thenReturn(true);

        assertThatThrownBy(() -> topicService.subscribe(user, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    // --- unsubscribe ---

    @Test
    void unsubscribe_success_deletesSubscription() {
        Topic topic = Topic.builder().id(1L).name("Java").build();
        Subscription sub = Subscription.builder().id(10L).user(user).topic(topic).build();

        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.findByUserAndTopic(user, topic)).thenReturn(Optional.of(sub));

        topicService.unsubscribe(user, 1L);

        verify(subscriptionRepository).delete(sub);
    }

    @Test
    void unsubscribe_topicNotFound_throwsNotFound() {
        when(topicRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> topicService.unsubscribe(user, 99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void unsubscribe_notSubscribed_throwsNotFound() {
        Topic topic = Topic.builder().id(1L).name("Java").build();

        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.findByUserAndTopic(user, topic)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> topicService.unsubscribe(user, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }
}
