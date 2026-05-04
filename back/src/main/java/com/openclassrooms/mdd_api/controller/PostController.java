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

/** Endpoints de gestion des articles et commentaires. */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * Retourne le fil d'actualité de l'utilisateur connecté (articles des thèmes abonnés).
     *
     * @param user utilisateur authentifié (injecté par Spring Security)
     * @param sort ordre de tri : {@code desc} (défaut) ou {@code asc}
     * @return liste d'articles résumés
     */
    @GetMapping("/feed")
    public ResponseEntity<List<PostSummaryResponse>> getFeed(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "desc") String sort) {
        return ResponseEntity.ok(postService.getFeed(user, sort));
    }

    /**
     * Crée un nouvel article pour l'utilisateur connecté.
     *
     * @param user    auteur de l'article
     * @param request titre, contenu et identifiant du thème
     * @return article créé
     */
    @PostMapping
    public ResponseEntity<PostSummaryResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.create(user, request));
    }

    /**
     * Retourne le détail d'un article avec ses commentaires.
     *
     * @param id identifiant de l'article
     * @return article complet avec liste de commentaires
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    /**
     * Ajoute un commentaire à un article existant.
     *
     * @param user    auteur du commentaire
     * @param id      identifiant de l'article
     * @param request contenu du commentaire
     * @return commentaire créé
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(postService.addComment(user, id, request));
    }
}
