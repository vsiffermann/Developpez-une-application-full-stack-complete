package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.TopicResponse;
import com.openclassrooms.mdd_api.entity.Subscription;
import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.SubscriptionRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubscriptionRepository subscriptionRepository;

    public List<TopicResponse> getAll(User user) {
        Set<Long> subscribedIds = subscriptionRepository.findByUser(user).stream()
                .map(sub -> sub.getTopic().getId())
                .collect(Collectors.toSet());

        return topicRepository.findAll().stream()
                .map(topic -> new TopicResponse(
                        topic.getId(),
                        topic.getName(),
                        topic.getDescription(),
                        subscribedIds.contains(topic.getId())
                ))
                .toList();
    }

    public void subscribe(User user, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));

        if (subscriptionRepository.existsByUserAndTopic(user, topic)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous êtes déjà abonné à ce thème");
        }

        subscriptionRepository.save(Subscription.builder().user(user).topic(topic).build());
    }

    public void unsubscribe(User user, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));

        Subscription subscription = subscriptionRepository.findByUserAndTopic(user, topic)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vous n'êtes pas abonné à ce thème"));

        subscriptionRepository.delete(subscription);
    }
}
