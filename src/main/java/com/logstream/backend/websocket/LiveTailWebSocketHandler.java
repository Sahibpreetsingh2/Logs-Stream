package com.logstream.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logstream.backend.model.LogEntry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class LiveTailWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper()
            .findAndRegisterModules(); // registers the JavaTimeModule so Instant serializes cleanly

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("[LiveTail] Client connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("[LiveTail] Client disconnected: " + session.getId());
    }

    /**
     * Broadcasts a real LogEntry to all connected clients.
     * Called by LogGrpcService whenever a new log is received.
     */
    public void broadcastLogEntry(LogEntry entry) {
        if (sessions.isEmpty()) {
            return;
        }

        String json;
        try {
            json = objectMapper.writeValueAsString(entry);
        } catch (Exception e) {
            System.out.println("[LiveTail] Failed to serialize log entry: " + e.getMessage());
            return;
        }

        for (WebSocketSession session : sessions) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            } catch (Exception e) {
                System.out.println("[LiveTail] Failed to send to " + session.getId() + ": " + e.getMessage());
            }
        }
    }
}