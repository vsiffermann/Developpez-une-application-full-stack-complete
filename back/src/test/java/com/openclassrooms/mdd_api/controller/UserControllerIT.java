package com.openclassrooms.mdd_api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerIT {

    @Autowired private MockMvc mockMvc;

    // --- GET /api/users/me ---

    @Test
    void getProfile_authenticated_returns200WithUserInfo() throws Exception {
        // given a valid JWT token in the Authorization header, when GET /api/users/me, then status 200 with id, email and username
    }

    @Test
    void getProfile_noToken_returns403() throws Exception {
        // given no Authorization header, when GET /api/users/me, then status 403
    }

    // --- PUT /api/users/me ---

    @Test
    void updateProfile_changeUsername_returns200() throws Exception {
        // given a valid JWT and a new unique username, when PUT /api/users/me, then status 200 and updated username in response
    }

    @Test
    void updateProfile_takenEmail_returns409() throws Exception {
        // given a valid JWT and an email already used by another user, when PUT /api/users/me, then status 409
    }

    @Test
    void updateProfile_noToken_returns403() throws Exception {
        // given no Authorization header, when PUT /api/users/me, then status 403
    }
}
