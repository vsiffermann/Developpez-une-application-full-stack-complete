package com.openclassrooms.mdd_api.controller;

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

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserControllerIT {

    @Autowired private WebApplicationContext webApplicationContext;
    @Autowired private JwtService jwtService;

    private MockMvc mockMvc;
    private String aliceToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        aliceToken = jwtService.generateToken("alice@example.com");
    }

    // --- GET /api/users/me ---

    @Test
    void getProfile_authenticated_returns200WithUserInfo() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    void getProfile_noToken_returns403() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isForbidden());
    }

    // --- PUT /api/users/me ---

    @Test
    void updateProfile_changeUsername_returns200() throws Exception {
        String body = """
                {"username":"alice_updated"}
                """;

        mockMvc.perform(put("/api/users/me")
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice_updated"))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void updateProfile_takenEmail_returns409() throws Exception {
        String body = """
                {"email":"bob@example.com"}
                """;

        mockMvc.perform(put("/api/users/me")
                .header("Authorization", "Bearer " + aliceToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void updateProfile_noToken_returns403() throws Exception {
        String body = """
                {"username":"hacker"}
                """;

        mockMvc.perform(put("/api/users/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isForbidden());
    }
}
