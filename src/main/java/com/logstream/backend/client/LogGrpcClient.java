package com.logstream.backend.client;

import com.logstream.backend.grpc.LogMessage;
import com.logstream.backend.grpc.LogResponse;
import com.logstream.backend.grpc.LogServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class LogGrpcClient {

    public static void main(String[] args) {

        ManagedChannel channel = ManagedChannelBuilder
                .forAddress("localhost", 9090)
                .usePlaintext()
                .build();

        LogServiceGrpc.LogServiceBlockingStub stub =
                LogServiceGrpc.newBlockingStub(channel);

        LogMessage log = LogMessage.newBuilder()
                .setId("LOG-001")
                .setTimestamp("2026-08-21T16:40:00")
                .setServiceName("payment-service")
                .setLevel("ERROR")
                .setMessage("Database connection timeout")
                .setResponseTime(1500)
                .build();

        LogResponse response = stub.sendLog(log);

        System.out.println("Response: " + response.getMessage());
        System.out.println("Success: " + response.getSuccess());

        channel.shutdown();
    }
}
