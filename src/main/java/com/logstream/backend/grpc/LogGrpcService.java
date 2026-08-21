package com.logstream.backend.grpc;
import io.grpc.stub.StreamObserver;
import org.springframework.grpc.server.service.GrpcService;


@GrpcService
public class LogGrpcService extends LogServiceGrpc.LogServiceImplBase {

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

        LogResponse response = LogResponse.newBuilder()
                .setMessage("Log received successfully")
                .setSuccess(true)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}