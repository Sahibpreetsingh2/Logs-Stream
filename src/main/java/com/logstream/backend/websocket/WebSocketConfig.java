package com.logstream.backend.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig  implements WebSocketConfigurer {

	    private final LiveTailWebSocketHandler liveTailWebSocketHandler;

	    public WebSocketConfig(LiveTailWebSocketHandler liveTailWebSocketHandler) {
	        this.liveTailWebSocketHandler = liveTailWebSocketHandler;
	    }

	    @Override
	    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	        registry.addHandler(liveTailWebSocketHandler, "/live-tail")
	                .setAllowedOrigins("*"); // tighten this before production
	    }
	}


