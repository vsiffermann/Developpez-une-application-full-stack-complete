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
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    // --- getProfile ---

    @Test
    void getProfile_returnsUserResponse() {
        // given a User with id, email, and username, when getProfile is called, then a UserResponse with matching fields is returned
    }

    // --- updateProfile ---

    @Test
    void updateProfile_emailChange_success() {
        // given a new email that is not already taken, when updateProfile is called, then the user's email is updated and saved
    }

    @Test
    void updateProfile_emailAlreadyUsed_throwsConflict() {
        // given a new email that already exists in the repository, when updateProfile is called, then a ResponseStatusException with status 409 is thrown
    }

    @Test
    void updateProfile_usernameChange_success() {
        // given a new username that is not already taken, when updateProfile is called, then the user's username is updated and saved
    }

    @Test
    void updateProfile_usernameAlreadyUsed_throwsConflict() {
        // given a new username that already exists in the repository, when updateProfile is called, then a ResponseStatusException with status 409 is thrown
    }

    @Test
    void updateProfile_passwordChange_encodesPassword() {
        // given a new password in the request, when updateProfile is called, then passwordEncoder.encode is called and the encoded value is saved
    }

    @Test
    void updateProfile_noChange_doesNotThrow() {
        // given email and username in the request are identical to the current user values, when updateProfile is called, then no exception is thrown and the user is saved unchanged
    }
}
