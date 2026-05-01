package com.openclassrooms.mdd_api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIT {

    @Autowired private MockMvc mockMvc;

    // --- POST /api/auth/register ---

    @Test
    void register_validRequest_returns200WithToken() throws Exception {
        // given a valid register payload with unique email and username, when POST /api/auth/register, then status 200 and body contains token and user info
    }

    @Test
    void register_duplicateEmail_returns409() throws Exception {
        // given an email already present in the database, when POST /api/auth/register, then status 409
    }

    @Test
    void register_weakPassword_returns400() throws Exception {
        // given a password that does not meet the security requirements, when POST /api/auth/register, then status 400 with validation errors
    }

    @Test
    void register_missingFields_returns400() throws Exception {
        // given a request body with missing required fields, when POST /api/auth/register, then status 400
    }

    // --- POST /api/auth/login ---

    @Test
    void login_withEmail_returns200WithToken() throws Exception {
        // given a registered user and a login payload using their email, when POST /api/auth/login, then status 200 and body contains token
    }

    @Test
    void login_withUsername_returns200WithToken() throws Exception {
        // given a registered user and a login payload using their username, when POST /api/auth/login, then status 200 and body contains token
    }

    @Test
    void login_wrongPassword_returns401() throws Exception {
        // given a registered user and a login payload with an incorrect password, when POST /api/auth/login, then status 401
    }

    @Test
    void login_unknownIdentifier_returns401() throws Exception {
        // given an identifier that does not match any user, when POST /api/auth/login, then status 401
    }
}
