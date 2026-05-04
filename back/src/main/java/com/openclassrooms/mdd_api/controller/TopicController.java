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

/** Endpoints de consultation et gestion des abonnements aux thèmes. */
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    /**
     * Retourne tous les thèmes disponibles avec le statut d'abonnement de l'utilisateur.
     *
     * @param user utilisateur authentifié
     * @return liste de thèmes avec le champ {@code subscribed}
     */
    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(topicService.getAll(user));
    }

    /**
     * Abonne l'utilisateur au thème identifié.
     *
     * @param user utilisateur authentifié
     * @param id   identifiant du thème
     * @return message de confirmation
     */
    @PostMapping("/{id}/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        topicService.subscribe(user, id);
        return ResponseEntity.ok(Map.of("message", "Abonnement effectué"));
    }

    /**
     * Désabonne l'utilisateur du thème identifié.
     *
     * @param user utilisateur authentifié
     * @param id   identifiant du thème
     * @return message de confirmation
     */
    @DeleteMapping("/{id}/subscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        topicService.unsubscribe(user, id);
        return ResponseEntity.ok(Map.of("message", "Désabonnement effectué"));
    }
}
