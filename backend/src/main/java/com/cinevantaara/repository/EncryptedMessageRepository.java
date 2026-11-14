package com.cinevantaara.repository;

import com.cinevantaara.entity.EncryptedMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EncryptedMessageRepository extends JpaRepository<EncryptedMessage, String> {
    List<EncryptedMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);
}
