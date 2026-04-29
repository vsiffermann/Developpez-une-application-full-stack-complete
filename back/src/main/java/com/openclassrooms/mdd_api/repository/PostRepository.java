package com.openclassrooms.mdd_api.repository;

import com.openclassrooms.mdd_api.entity.Post;
import com.openclassrooms.mdd_api.entity.Topic;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByTopicIn(List<Topic> topics, Sort sort);
}
