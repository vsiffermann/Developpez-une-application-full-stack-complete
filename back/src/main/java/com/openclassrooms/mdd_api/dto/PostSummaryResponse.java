package com.openclassrooms.mdd_api.dto;

import java.time.LocalDateTime;

public record PostSummaryResponse(
        Long id,
        String title,
        String content,
        String authorUsername,
        String topicName,
        LocalDateTime createdAt
) {}
