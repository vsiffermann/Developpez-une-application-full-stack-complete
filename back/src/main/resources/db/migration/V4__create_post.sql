CREATE TABLE `post` (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    author_id  BIGINT       NOT NULL,
    topic_id   BIGINT       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id)  ON DELETE CASCADE,
    FOREIGN KEY (topic_id)  REFERENCES topic(id) ON DELETE CASCADE
);
