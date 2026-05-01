package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.CreateCommentRequest;
import com.openclassrooms.mdd_api.dto.CreatePostRequest;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.CommentRepository;
import com.openclassrooms.mdd_api.repository.PostRepository;
import com.openclassrooms.mdd_api.repository.SubscriptionRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private TopicRepository topicRepository;
    @Mock private SubscriptionRepository subscriptionRepository;
    @Mock private CommentRepository commentRepository;
    @InjectMocks private PostService postService;

    // --- getFeed ---

    @Test
    void getFeed_withSubscriptions_returnsPostsSortedDesc() {
        // given the user is subscribed to one topic that has two posts, when getFeed is called with sort="desc", then a list of posts ordered by createdAt descending is returned
    }

    @Test
    void getFeed_withSubscriptions_returnsPostsSortedAsc() {
        // given the user is subscribed to one topic that has two posts, when getFeed is called with sort="asc", then a list of posts ordered by createdAt ascending is returned
    }

    @Test
    void getFeed_noSubscriptions_returnsEmptyList() {
        // given the user has no subscriptions, when getFeed is called, then an empty list is returned without calling postRepository
    }

    // --- create ---

    @Test
    void create_success_returnsPostSummary() {
        // given the topic exists, when create is called, then postRepository.save is called and a PostSummaryResponse is returned
    }

    @Test
    void create_topicNotFound_throwsNotFound() {
        // given topicRepository.findById returns empty, when create is called, then a ResponseStatusException with status 404 is thrown
    }

    // --- getById ---

    @Test
    void getById_success_returnsPostWithComments() {
        // given a post exists with two comments, when getById is called, then a PostDetailResponse containing both comments is returned
    }

    @Test
    void getById_notFound_throwsNotFound() {
        // given postRepository.findById returns empty, when getById is called, then a ResponseStatusException with status 404 is thrown
    }

    // --- addComment ---

    @Test
    void addComment_success_returnsCommentResponse() {
        // given the post exists, when addComment is called, then commentRepository.save is called and a CommentResponse is returned
    }

    @Test
    void addComment_postNotFound_throwsNotFound() {
        // given postRepository.findById returns empty, when addComment is called, then a ResponseStatusException with status 404 is thrown
    }
}
