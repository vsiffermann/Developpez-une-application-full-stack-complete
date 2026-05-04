package com.openclassrooms.mdd_api.repository;

import com.openclassrooms.mdd_api.entity.Subscription;
import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsByUserAndTopic(User user, Topic topic);

    Optional<Subscription> findByUserAndTopic(User user, Topic topic);

    List<Subscription> findByUser(User user);
}
