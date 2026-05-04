package com.openclassrooms.mdd_api.repository;

import com.openclassrooms.mdd_api.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}
