package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.dto.TopicResponse;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(topicService.getAll(user));
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        topicService.subscribe(user, id);
        return ResponseEntity.ok(Map.of("message", "Abonnement effectué"));
    }

    @DeleteMapping("/{id}/subscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        topicService.unsubscribe(user, id);
        return ResponseEntity.ok(Map.of("message", "Désabonnement effectué"));
    }
}
