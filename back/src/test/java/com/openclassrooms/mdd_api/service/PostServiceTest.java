package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.CommentResponse;
import com.openclassrooms.mdd_api.dto.CreateCommentRequest;
import com.openclassrooms.mdd_api.dto.CreatePostRequest;
import com.openclassrooms.mdd_api.dto.PostDetailResponse;
import com.openclassrooms.mdd_api.dto.PostSummaryResponse;
import com.openclassrooms.mdd_api.entity.Comment;
import com.openclassrooms.mdd_api.entity.Post;
import com.openclassrooms.mdd_api.entity.Subscription;
import com.openclassrooms.mdd_api.entity.Topic;
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
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private TopicRepository topicRepository;
    @Mock private SubscriptionRepository subscriptionRepository;
    @Mock private CommentRepository commentRepository;
    @InjectMocks private PostService postService;

    private final User alice = User.builder().id(1L).email("alice@test.com").username("alice").build();
    private final Topic java  = Topic.builder().id(1L).name("Java").description("Java").build();

    // --- getFeed ---

    @Test
    void getFeed_withSubscriptions_returnsPostsSortedDesc() {
        LocalDateTime older = LocalDateTime.of(2026, 4, 1, 10, 0);
        LocalDateTime newer = LocalDateTime.of(2026, 5, 1, 10, 0);
        Post p1 = Post.builder().id(1L).title("Old").content("...").author(alice).topic(java).createdAt(older).comments(List.of()).build();
        Post p2 = Post.builder().id(2L).title("New").content("...").author(alice).topic(java).createdAt(newer).comments(List.of()).build();
        Subscription sub = Subscription.builder().user(alice).topic(java).build();

        when(subscriptionRepository.findByUser(alice)).thenReturn(List.of(sub));
        when(postRepository.findByTopicIn(eq(List.of(java)), any(Sort.class))).thenReturn(List.of(p2, p1));

        List<PostSummaryResponse> result = postService.getFeed(alice, "desc");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).title()).isEqualTo("New");
    }

    @Test
    void getFeed_withSubscriptions_returnsPostsSortedAsc() {
        LocalDateTime older = LocalDateTime.of(2026, 4, 1, 10, 0);
        LocalDateTime newer = LocalDateTime.of(2026, 5, 1, 10, 0);
        Post p1 = Post.builder().id(1L).title("Old").content("...").author(alice).topic(java).createdAt(older).comments(List.of()).build();
        Post p2 = Post.builder().id(2L).title("New").content("...").author(alice).topic(java).createdAt(newer).comments(List.of()).build();
        Subscription sub = Subscription.builder().user(alice).topic(java).build();

        when(subscriptionRepository.findByUser(alice)).thenReturn(List.of(sub));
        when(postRepository.findByTopicIn(eq(List.of(java)), any(Sort.class))).thenReturn(List.of(p1, p2));

        List<PostSummaryResponse> result = postService.getFeed(alice, "asc");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).title()).isEqualTo("Old");
    }

    @Test
    void getFeed_noSubscriptions_returnsEmptyList() {
        when(subscriptionRepository.findByUser(alice)).thenReturn(List.of());

        List<PostSummaryResponse> result = postService.getFeed(alice, "desc");

        assertThat(result).isEmpty();
    }

    // --- create ---

    @Test
    void create_success_returnsPostSummary() {
        CreatePostRequest request = new CreatePostRequest("Mon article", "Contenu", 1L);
        Post saved = Post.builder().id(10L).title("Mon article").content("Contenu").author(alice).topic(java)
                .createdAt(LocalDateTime.now()).comments(List.of()).build();

        when(topicRepository.findById(1L)).thenReturn(Optional.of(java));
        when(postRepository.save(any(Post.class))).thenReturn(saved);

        PostSummaryResponse result = postService.create(alice, request);

        assertThat(result.title()).isEqualTo("Mon article");
        assertThat(result.authorUsername()).isEqualTo("alice");
        assertThat(result.topicName()).isEqualTo("Java");
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void create_topicNotFound_throwsNotFound() {
        CreatePostRequest request = new CreatePostRequest("Titre", "Contenu", 99L);
        when(topicRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.create(alice, request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    // --- getById ---

    @Test
    void getById_success_returnsPostWithComments() {
        User bob = User.builder().id(2L).email("bob@test.com").username("bob").build();
        Comment c1 = Comment.builder().id(1L).content("Cool").author(bob).createdAt(LocalDateTime.now()).build();
        Comment c2 = Comment.builder().id(2L).content("Super").author(bob).createdAt(LocalDateTime.now()).build();
        Post post = Post.builder().id(1L).title("Article").content("...").author(alice).topic(java)
                .createdAt(LocalDateTime.now()).comments(List.of(c1, c2)).build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostDetailResponse result = postService.getById(1L);

        assertThat(result.title()).isEqualTo("Article");
        assertThat(result.comments()).hasSize(2);
        assertThat(result.comments().get(0).content()).isEqualTo("Cool");
    }

    @Test
    void getById_notFound_throwsNotFound() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    // --- addComment ---

    @Test
    void addComment_success_returnsCommentResponse() {
        CreateCommentRequest request = new CreateCommentRequest("Excellent !");
        Post post = Post.builder().id(1L).title("Article").content("...").author(alice).topic(java)
                .createdAt(LocalDateTime.now()).comments(List.of()).build();
        Comment saved = Comment.builder().id(5L).content("Excellent !").author(alice).createdAt(LocalDateTime.now()).build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(Comment.class))).thenReturn(saved);

        CommentResponse result = postService.addComment(alice, 1L, request);

        assertThat(result.content()).isEqualTo("Excellent !");
        assertThat(result.authorUsername()).isEqualTo("alice");
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void addComment_postNotFound_throwsNotFound() {
        CreateCommentRequest request = new CreateCommentRequest("Commentaire");
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.addComment(alice, 99L, request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }
}
