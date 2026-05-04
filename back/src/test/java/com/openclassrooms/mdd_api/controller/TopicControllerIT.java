package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.entity.Topic;
import com.openclassrooms.mdd_api.repository.TopicRepository;
import com.openclassrooms.mdd_api.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TopicControllerIT {

    @Autowired private WebApplicationContext webApplicationContext;
    @Autowired private JwtService jwtService;
    @Autowired private TopicRepository topicRepository;

    private MockMvc mockMvc;
    private String aliceToken;

    // alice is subscribed to: JavaScript, Python
    // alice is NOT subscribed to: Java, Web3, DevOps

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

    // --- GET /api/topics ---

    @Test
    void getTopics_authenticated_returns200WithList() throws Exception {
        mockMvc.perform(get("/api/topics")
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[0].name").isString())
                .andExpect(jsonPath("$[0].subscribed").isBoolean());
    }

    @Test
    void getTopics_noToken_returns403() throws Exception {
        mockMvc.perform(get("/api/topics"))
                .andExpect(status().isForbidden());
    }

    // --- POST /api/topics/{id}/subscribe ---

    @Test
    void subscribe_validTopic_returns200() throws Exception {
        Long javaId = topicIdByName("Java");

        mockMvc.perform(post("/api/topics/{id}/subscribe", javaId)
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    void subscribe_alreadySubscribed_returns409() throws Exception {
        Long jsId = topicIdByName("JavaScript");

        mockMvc.perform(post("/api/topics/{id}/subscribe", jsId)
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    void subscribe_unknownTopic_returns404() throws Exception {
        mockMvc.perform(post("/api/topics/{id}/subscribe", 9999L)
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // --- DELETE /api/topics/{id}/subscribe ---

    @Test
    void unsubscribe_validSubscription_returns200() throws Exception {
        Long jsId = topicIdByName("JavaScript");

        mockMvc.perform(delete("/api/topics/{id}/subscribe", jsId)
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    void unsubscribe_notSubscribed_returns404() throws Exception {
        Long javaId = topicIdByName("Java");

        mockMvc.perform(delete("/api/topics/{id}/subscribe", javaId)
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isNotFound());
    }
}
