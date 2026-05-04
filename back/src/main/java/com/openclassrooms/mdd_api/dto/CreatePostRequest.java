package com.openclassrooms.mdd_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePostRequest(
        @NotBlank(message = "Le titre est requis")
        String title,

        @NotBlank(message = "Le contenu est requis")
        String content,

        @NotNull(message = "Le thème est requis")
        Long topicId
) {}
