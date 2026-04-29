package com.openclassrooms.mdd_api.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        String authorUsername,
        LocalDateTime createdAt
) {}
