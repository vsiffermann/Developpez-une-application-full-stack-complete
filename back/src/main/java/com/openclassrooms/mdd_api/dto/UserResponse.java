package com.openclassrooms.mdd_api.dto;

public record UserResponse(
        Long id,
        String email,
        String username
) {}
