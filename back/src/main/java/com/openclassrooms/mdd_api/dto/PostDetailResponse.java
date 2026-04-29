package com.openclassrooms.mdd_api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostDetailResponse(
        Long id,
        String title,
        String content,
        String authorUsername,
        String topicName,
        LocalDateTime createdAt,
        List<CommentResponse> comments
) {}
