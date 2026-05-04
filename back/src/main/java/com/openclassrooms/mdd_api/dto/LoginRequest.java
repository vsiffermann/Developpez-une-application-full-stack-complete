package com.openclassrooms.mdd_api.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "L'identifiant est requis")
        String identifier,

        @NotBlank(message = "Le mot de passe est requis")
        String password
) {}
