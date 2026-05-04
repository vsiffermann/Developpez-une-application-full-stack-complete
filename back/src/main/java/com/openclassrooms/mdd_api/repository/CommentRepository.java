package com.openclassrooms.mdd_api.repository;

import com.openclassrooms.mdd_api.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
