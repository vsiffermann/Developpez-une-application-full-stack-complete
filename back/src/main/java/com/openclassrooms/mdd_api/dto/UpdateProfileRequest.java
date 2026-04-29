package com.openclassrooms.mdd_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Email(message = "Email invalide")
        String email,

        @Size(min = 3, max = 100, message = "Le nom d'utilisateur doit faire entre 3 et 100 caractères")
        String username,

        @Pattern(regexp = ValidationConstants.PASSWORD_REGEXP, message = ValidationConstants.PASSWORD_MESSAGE)
        String password
) {}
