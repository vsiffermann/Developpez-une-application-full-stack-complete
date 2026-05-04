package com.openclassrooms.mdd_api.dto;

public record TopicResponse(
        Long id,
        String name,
        String description,
        boolean subscribed
) {}
