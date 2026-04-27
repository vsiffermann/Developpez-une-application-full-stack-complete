CREATE TABLE `subscription` (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    topic_id   BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_topic (user_id, topic_id),
    FOREIGN KEY (user_id)  REFERENCES user(id)  ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topic(id) ON DELETE CASCADE
);
