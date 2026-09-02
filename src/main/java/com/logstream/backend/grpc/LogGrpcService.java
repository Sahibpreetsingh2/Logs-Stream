package com.logstream.backend.grpc;

import com.logstream.backend.model.LogEntry;
import com.logstream.backend.model.LogEntryStore;
import com.logstream.backend.service.LogProcessingService;
import com.logstream.backend.websocket.LiveTailWebSocketHandler;
import io.grpc.stub.StreamObserver;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class LogGrpcService extends LogServiceGrpc.LogServiceImplBase {

    private final LogProcessingService logProcessingService;
    private final LogEntryStore logEntryStore;
    private final LiveTailWebSocketHandler liveTailWebSocketHandler;

    public LogGrpcService(LogProcessingService logProcessingService,
                           LogEntryStore logEntryStore,
                           LiveTailWebSocketHandler liveTailWebSocketHandler) {
        this.logProcessingService = logProcessingService;
        this.logEntryStore = logEntryStore;
        this.liveTailWebSocketHandler = liveTailWebSocketHandler;
    }

    @Override
    public void sendLog(
            LogMessage request,
            StreamObserver<LogResponse> responseObserver) {

        System.out.println("========== LOG RECEIVED ==========");
        System.out.println("ID: " + request.getId());
        System.out.println("Timestamp: " + request.getTimestamp());
        System.out.println("Service: " + request.getServiceName());
        System.out.println("Level: " + request.getLevel());
        System.out.println("Message: " + request.getMessage());
        System.out.println("Response Time: " + request.getResponseTime());

        // Convert the raw gRPC message into our shared LogEntry model
        LogEntry entry = logProcessingService.processLog(request);

        // Store it so AlertChecker can check it on the next scheduled run
        logEntryStore.add(entry);

        // Broadcast it live to any connected WebSocket clients (Live Tail)
        liveTailWebSocketHandler.broadcastLogEntry(entry);

        LogResponse response = LogResponse.newBuilder()
                .setMessage("Log received successfully")
                .setSuccess(true)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}