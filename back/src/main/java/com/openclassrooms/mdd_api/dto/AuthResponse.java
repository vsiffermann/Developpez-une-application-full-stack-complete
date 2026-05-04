package com.openclassrooms.mdd_api.dto;

public record AuthResponse(String token, UserInfo user) {
    public record UserInfo(Long id, String email, String username) {}
}
