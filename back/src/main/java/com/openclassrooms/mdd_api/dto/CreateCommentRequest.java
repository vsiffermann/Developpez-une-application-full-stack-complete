package com.openclassrooms.mdd_api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
        @NotBlank(message = "Le commentaire ne peut pas être vide")
        String content
) {}
