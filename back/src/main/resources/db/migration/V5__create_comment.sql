CREATE TABLE `comment` (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    content    TEXT   NOT NULL,
    author_id  BIGINT NOT NULL,
    post_id    BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id)  ON DELETE CASCADE,
    FOREIGN KEY (post_id)   REFERENCES post(id)  ON DELETE CASCADE
);
