package com.openclassrooms.mdd_api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TopicControllerIT {

    @Autowired private MockMvc mockMvc;

    // --- GET /api/topics ---

    @Test
    void getTopics_authenticated_returns200WithList() throws Exception {
        // given a valid JWT and topics in the database, when GET /api/topics, then status 200 and a non-empty list with subscribed flags
    }

    @Test
    void getTopics_noToken_returns403() throws Exception {
        // given no Authorization header, when GET /api/topics, then status 403
    }

    // --- POST /api/topics/{id}/subscribe ---

    @Test
    void subscribe_validTopic_returns200() throws Exception {
        // given a valid JWT and a topic the user is not yet subscribed to, when POST /api/topics/{id}/subscribe, then status 200
    }

    @Test
    void subscribe_alreadySubscribed_returns409() throws Exception {
        // given a valid JWT and a topic the user is already subscribed to, when POST /api/topics/{id}/subscribe, then status 409
    }

    @Test
    void subscribe_unknownTopic_returns404() throws Exception {
        // given a valid JWT and a topic id that does not exist, when POST /api/topics/{id}/subscribe, then status 404
    }

    // --- DELETE /api/topics/{id}/subscribe ---

    @Test
    void unsubscribe_validSubscription_returns200() throws Exception {
        // given a valid JWT and an active subscription, when DELETE /api/topics/{id}/subscribe, then status 200
    }

    @Test
    void unsubscribe_notSubscribed_returns404() throws Exception {
        // given a valid JWT but the user is not subscribed to the topic, when DELETE /api/topics/{id}/subscribe, then status 404
    }
}
