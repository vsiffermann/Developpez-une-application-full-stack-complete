package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.AuthResponse;
import com.openclassrooms.mdd_api.dto.LoginRequest;
import com.openclassrooms.mdd_api.dto.RegisterRequest;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @InjectMocks private AuthService authService;

    // --- register ---

    @Test
    void register_success_returnsTokenAndUserInfo() {
        RegisterRequest request = new RegisterRequest("alice@test.com", "alice", "P@ssw0rd1");
        User savedUser = User.builder().id(1L).email("alice@test.com").username("alice").password("encoded").build();

        when(userRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("P@ssw0rd1")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("alice@test.com")).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("alice@test.com");
        assertThat(response.user().username()).isEqualTo("alice");
    }

    @Test
    void register_emailAlreadyExists_throwsConflict() {
        RegisterRequest request = new RegisterRequest("alice@test.com", "alice", "P@ssw0rd1");
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void register_usernameAlreadyExists_throwsConflict() {
        RegisterRequest request = new RegisterRequest("alice@test.com", "alice", "P@ssw0rd1");
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    // --- login ---

    @Test
    void login_withEmail_success() {
        LoginRequest request = new LoginRequest("alice@test.com", "P@ssw0rd1");
        User user = User.builder().id(1L).email("alice@test.com").username("alice").password("encoded").build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("P@ssw0rd1", "encoded")).thenReturn(true);
        when(jwtService.generateToken("alice@test.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().username()).isEqualTo("alice");
    }

    @Test
    void login_withUsername_success() {
        LoginRequest request = new LoginRequest("alice", "P@ssw0rd1");
        User user = User.builder().id(1L).email("alice@test.com").username("alice").password("encoded").build();

        when(userRepository.findByEmail("alice")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("P@ssw0rd1", "encoded")).thenReturn(true);
        when(jwtService.generateToken("alice@test.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
    }

    @Test
    void login_userNotFound_throwsBadCredentials() {
        LoginRequest request = new LoginRequest("unknown", "P@ssw0rd1");
        when(userRepository.findByEmail("unknown")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_wrongPassword_throwsBadCredentials() {
        LoginRequest request = new LoginRequest("alice@test.com", "wrongpassword");
        User user = User.builder().id(1L).email("alice@test.com").username("alice").password("encoded").build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
