package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.dto.*;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/feed")
    public ResponseEntity<List<PostSummaryResponse>> getFeed(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "desc") String sort) {
        return ResponseEntity.ok(postService.getFeed(user, sort));
    }

    @PostMapping
    public ResponseEntity<PostSummaryResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.create(user, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(postService.addComment(user, id, request));
    }
}
