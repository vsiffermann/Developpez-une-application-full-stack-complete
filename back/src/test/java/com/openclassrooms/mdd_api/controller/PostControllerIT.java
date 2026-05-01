package com.openclassrooms.mdd_api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PostControllerIT {

    @Autowired private MockMvc mockMvc;

    // --- GET /api/posts/feed ---

    @Test
    void getFeed_withSubscriptions_returns200WithPosts() throws Exception {
        // given a valid JWT and a user subscribed to topics that have posts, when GET /api/posts/feed, then status 200 and a non-empty list
    }

    @Test
    void getFeed_sortAsc_returnsOldestFirst() throws Exception {
        // given a valid JWT and multiple posts, when GET /api/posts/feed?sort=asc, then posts are ordered by createdAt ascending
    }

    @Test
    void getFeed_sortDesc_returnsNewestFirst() throws Exception {
        // given a valid JWT and multiple posts, when GET /api/posts/feed?sort=desc, then posts are ordered by createdAt descending
    }

    @Test
    void getFeed_noSubscriptions_returnsEmptyList() throws Exception {
        // given a valid JWT for a user with no subscriptions, when GET /api/posts/feed, then status 200 and an empty list
    }

    @Test
    void getFeed_noToken_returns403() throws Exception {
        // given no Authorization header, when GET /api/posts/feed, then status 403
    }

    // --- POST /api/posts ---

    @Test
    void createPost_validRequest_returns200WithPost() throws Exception {
        // given a valid JWT and a payload with title, content, and an existing topicId, when POST /api/posts, then status 200 and the created post in the response
    }

    @Test
    void createPost_unknownTopic_returns404() throws Exception {
        // given a valid JWT and a topicId that does not exist, when POST /api/posts, then status 404
    }

    @Test
    void createPost_missingTitle_returns400() throws Exception {
        // given a valid JWT and a payload missing the title field, when POST /api/posts, then status 400
    }

    // --- GET /api/posts/{id} ---

    @Test
    void getPost_exists_returns200WithComments() throws Exception {
        // given a valid JWT and an existing post with comments, when GET /api/posts/{id}, then status 200 with post details and comment list
    }

    @Test
    void getPost_notFound_returns404() throws Exception {
        // given a valid JWT and a post id that does not exist, when GET /api/posts/{id}, then status 404
    }

    // --- POST /api/posts/{id}/comments ---

    @Test
    void addComment_validRequest_returns200WithComment() throws Exception {
        // given a valid JWT and an existing post id with a non-empty comment content, when POST /api/posts/{id}/comments, then status 200 and the created comment in the response
    }

    @Test
    void addComment_postNotFound_returns404() throws Exception {
        // given a valid JWT and a post id that does not exist, when POST /api/posts/{id}/comments, then status 404
    }
}
