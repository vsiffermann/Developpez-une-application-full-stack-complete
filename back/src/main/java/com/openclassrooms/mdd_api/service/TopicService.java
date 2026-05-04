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

/** Logique métier de gestion des thèmes et des abonnements. */
@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubscriptionRepository subscriptionRepository;

    /**
     * Retourne tous les thèmes en indiquant si l'utilisateur y est abonné.
     *
     * @param user utilisateur dont on vérifie les abonnements
     * @return liste de tous les thèmes avec le champ {@code subscribed} calculé
     */
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

    /**
     * Abonne l'utilisateur au thème spécifié.
     *
     * @param user    utilisateur à abonner
     * @param topicId identifiant du thème
     * @throws org.springframework.web.server.ResponseStatusException 404 si le thème n'existe pas, 409 si déjà abonné
     */
    public void subscribe(User user, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));

        if (subscriptionRepository.existsByUserAndTopic(user, topic)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous êtes déjà abonné à ce thème");
        }

        subscriptionRepository.save(Subscription.builder().user(user).topic(topic).build());
    }

    /**
     * Désabonne l'utilisateur du thème spécifié.
     *
     * @param user    utilisateur à désabonner
     * @param topicId identifiant du thème
     * @throws org.springframework.web.server.ResponseStatusException 404 si le thème n'existe pas ou si l'abonnement est inexistant
     */
    public void unsubscribe(User user, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));

        Subscription subscription = subscriptionRepository.findByUserAndTopic(user, topic)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vous n'êtes pas abonné à ce thème"));

        subscriptionRepository.delete(subscription);
    }
}
