package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.*;
import com.openclassrooms.mdd_api.entity.Comment;
import com.openclassrooms.mdd_api.entity.Post;
import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.CommentRepository;
import com.openclassrooms.mdd_api.repository.PostRepository;
import com.openclassrooms.mdd_api.repository.SubscriptionRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final CommentRepository commentRepository;

    public List<PostSummaryResponse> getFeed(User user, String sort) {
        List<Topic> topics = subscriptionRepository.findByUser(user).stream()
                .map(sub -> sub.getTopic())
                .toList();

        if (topics.isEmpty()) {
            return List.of();
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sorting = Sort.by(direction, "createdAt");

        return postRepository.findByTopicIn(topics, sorting).stream()
                .map(post -> new PostSummaryResponse(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getAuthor().getUsername(),
                        post.getTopic().getName(),
                        post.getCreatedAt()
                ))
                .toList();
    }

    public PostSummaryResponse create(User user, CreatePostRequest request) {
        Topic topic = topicRepository.findById(request.topicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .author(user)
                .topic(topic)
                .build();

        post = postRepository.save(post);

        return new PostSummaryResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getUsername(),
                post.getTopic().getName(),
                post.getCreatedAt()
        );
    }

    public PostDetailResponse getById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable"));

        List<CommentResponse> comments = post.getComments().stream()
                .map(c -> new CommentResponse(
                        c.getId(),
                        c.getContent(),
                        c.getAuthor().getUsername(),
                        c.getCreatedAt()
                ))
                .toList();

        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getUsername(),
                post.getTopic().getName(),
                post.getCreatedAt(),
                comments
        );
    }

    public CommentResponse addComment(User user, Long postId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable"));

        Comment comment = Comment.builder()
                .content(request.content())
                .author(user)
                .post(post)
                .build();

        comment = commentRepository.save(comment);

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getCreatedAt()
        );
    }
}
