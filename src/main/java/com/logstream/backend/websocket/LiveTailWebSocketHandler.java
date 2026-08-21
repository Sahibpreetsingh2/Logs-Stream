package com.logstream.backend.websocket;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LiveTailWebSocketHandler extends TextWebSocketHandler {
	
	

	    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
	    private final AtomicInteger counter = new AtomicInteger(0);

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

	    // Broadcasts a mock log line every 5 seconds to all connected clients.
	    // Replace this with real log events once Member 1's gRPC stream is wired in.
	    @Scheduled(fixedRate = 5000)
	    public void broadcastMockLog() {
	        if (sessions.isEmpty()) {
	            return;
	        }

	        int n = counter.incrementAndGet();
	        String mockLogJson = String.format(
	                "{\"id\":\"LOG-%03d\",\"serviceName\":\"payment-service\",\"level\":\"INFO\",\"message\":\"Mock live log #%d\"}",
	                n, n
	        );

	        for (WebSocketSession session : sessions) {
	            try {
	                if (session.isOpen()) {
	                    session.sendMessage(new TextMessage(mockLogJson));
	                }
	            } catch (Exception e) {
	                System.out.println("[LiveTail] Failed to send to " + session.getId() + ": " + e.getMessage());
	            }
	        }
	    }
	}


