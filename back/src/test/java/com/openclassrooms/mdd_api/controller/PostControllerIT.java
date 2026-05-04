package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.entity.Post;
import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.PostRepository;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import com.openclassrooms.mdd_api.repository.UserRepository;
import com.openclassrooms.mdd_api.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PostControllerIT {

    @Autowired private WebApplicationContext webApplicationContext;
    @Autowired private JwtService jwtService;
    @Autowired private TopicRepository topicRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;
    private String aliceToken;

    // alice is subscribed to JavaScript + Python (both have posts in V7)

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        aliceToken = jwtService.generateToken("alice@example.com");
    }

    private Long topicIdByName(String name) {
        return topicRepository.findAll().stream()
                .filter(t -> t.getName().equals(name))
                .findFirst()
                .map(Topic::getId)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + name));
    }

    private Long anyPostId() {
        return postRepository.findAll().stream()
                .findFirst()
                .map(Post::getId)
                .orElseThrow(() -> new RuntimeException("No posts in test DB"));
    }

    // --- GET /api/posts/feed ---

    @Test
    void getFeed_withSubscriptions_returns200WithPosts() throws Exception {
        mockMvc.perform(get("/api/posts/feed")
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[0].title").isString())
                .andExpect(jsonPath("$[0].authorUsername").isString())
                .andExpect(jsonPath("$[0].topicName").isString());
    }

    @Test
    void getFeed_sortDesc_returnsNewestFirst() throws Exception {
        mockMvc.perform(get("/api/posts/feed?sort=desc")
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[0].createdAt").isString());
    }

    @Test
    void getFeed_sortAsc_returnsOldestFirst() throws Exception {
        mockMvc.perform(get("/api/posts/feed?sort=asc")
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void getFeed_noSubscriptions_returnsEmptyList() throws Exception {
        User noSubUser = User.builder()
                .email("nosub@test.com")
                .username("nosubuser")
                .password(passwordEncoder.encode("Test@1234"))
                .build();
        userRepository.save(noSubUser);
        String noSubToken = jwtService.generateToken("nosub@test.com");

        mockMvc.perform(get("/api/posts/feed")
                .header("Authorization", "Bearer " + noSubToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getFeed_noToken_returns403() throws Exception {
        mockMvc.perform(get("/api/posts/feed"))
                .andExpect(status().isForbidden());
    }

    // --- POST /api/posts ---

    @Test
    void createPost_validRequest_returns200WithPost() throws Exception {
        Long jsId = topicIdByName("JavaScript");
        String body = String.format("""
                {"title":"Test article","content":"Contenu de test suffisant","topicId":%d}
                """, jsId);

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Test article"))
                .andExpect(jsonPath("$.authorUsername").value("alice"))
                .andExpect(jsonPath("$.topicName").value("JavaScript"));
    }

    @Test
    void createPost_unknownTopic_returns404() throws Exception {
        String body = """
                {"title":"Test article","content":"Contenu de test","topicId":9999}
                """;

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void createPost_missingTitle_returns400() throws Exception {
        Long jsId = topicIdByName("JavaScript");
        String body = String.format("""
                {"content":"Contenu sans titre","topicId":%d}
                """, jsId);

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    // --- GET /api/posts/{id} ---

    @Test
    void getPost_exists_returns200WithComments() throws Exception {
        Long postId = anyPostId();

        mockMvc.perform(get("/api/posts/{id}", postId)
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(postId))
                .andExpect(jsonPath("$.title").isString())
                .andExpect(jsonPath("$.comments").isArray());
    }

    @Test
    void getPost_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/posts/{id}", 9999L)
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isNotFound());
    }

    // --- POST /api/posts/{id}/comments ---

    @Test
    void addComment_validRequest_returns200WithComment() throws Exception {
        Long postId = anyPostId();
        String body = """
                {"content":"Super article, merci !"}
                """;

        mockMvc.perform(post("/api/posts/{id}/comments", postId)
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.content").value("Super article, merci !"))
                .andExpect(jsonPath("$.authorUsername").value("alice"));
    }

    @Test
    void addComment_postNotFound_returns404() throws Exception {
        String body = """
                {"content":"Commentaire orphelin"}
                """;

        mockMvc.perform(post("/api/posts/{id}/comments", 9999L)
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isNotFound());
    }
}
