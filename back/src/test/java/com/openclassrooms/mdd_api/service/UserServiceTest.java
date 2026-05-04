package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.UpdateProfileRequest;
import com.openclassrooms.mdd_api.dto.UserResponse;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    // --- getProfile ---

    @Test
    void getProfile_returnsUserResponse() {
        User user = User.builder().id(1L).email("alice@test.com").username("alice").build();

        UserResponse response = userService.getProfile(user);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("alice@test.com");
        assertThat(response.username()).isEqualTo("alice");
    }

    // --- updateProfile ---

    @Test
    void updateProfile_emailChange_success() {
        User user = User.builder().id(1L).email("old@test.com").username("alice").build();
        UpdateProfileRequest request = new UpdateProfileRequest("new@test.com", null, null);

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(user, request);

        assertThat(user.getEmail()).isEqualTo("new@test.com");
        verify(userRepository).save(user);
    }

    @Test
    void updateProfile_emailAlreadyUsed_throwsConflict() {
        User user = User.builder().id(1L).email("old@test.com").username("alice").build();
        UpdateProfileRequest request = new UpdateProfileRequest("taken@test.com", null, null);

        when(userRepository.existsByEmail("taken@test.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.updateProfile(user, request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void updateProfile_usernameChange_success() {
        User user = User.builder().id(1L).email("alice@test.com").username("oldname").build();
        UpdateProfileRequest request = new UpdateProfileRequest(null, "newname", null);

        when(userRepository.existsByUsername("newname")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(user, request);

        assertThat(user.getUsername()).isEqualTo("newname");
        verify(userRepository).save(user);
    }

    @Test
    void updateProfile_usernameAlreadyUsed_throwsConflict() {
        User user = User.builder().id(1L).email("alice@test.com").username("oldname").build();
        UpdateProfileRequest request = new UpdateProfileRequest(null, "takenname", null);

        when(userRepository.existsByUsername("takenname")).thenReturn(true);

        assertThatThrownBy(() -> userService.updateProfile(user, request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void updateProfile_passwordChange_encodesPassword() {
        User user = User.builder().id(1L).email("alice@test.com").username("alice").password("old-encoded").build();
        UpdateProfileRequest request = new UpdateProfileRequest(null, null, "NewP@ss1");

        when(passwordEncoder.encode("NewP@ss1")).thenReturn("new-encoded");
        when(userRepository.save(user)).thenReturn(user);

        userService.updateProfile(user, request);

        verify(passwordEncoder).encode("NewP@ss1");
        assertThat(user.getPassword()).isEqualTo("new-encoded");
    }

    @Test
    void updateProfile_noChange_doesNotThrow() {
        User user = User.builder().id(1L).email("alice@test.com").username("alice").build();
        UpdateProfileRequest request = new UpdateProfileRequest("alice@test.com", "alice", null);

        when(userRepository.save(user)).thenReturn(user);

        assertThatCode(() -> userService.updateProfile(user, request)).doesNotThrowAnyException();
    }
}
