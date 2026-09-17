package com.logstream.backend.controller;

import com.logstream.backend.alert.AlertChecker;
import com.logstream.backend.index.LogIndexer;
import com.logstream.backend.model.LogEntry;
import com.logstream.backend.service.LogProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogProcessingService processingService;
    private final LogIndexer logIndexer;
    private final AlertChecker alertChecker;

    public LogController(
            LogProcessingService processingService,
            LogIndexer logIndexer,
            AlertChecker alertChecker
    ) {
        this.processingService = processingService;
        this.logIndexer = logIndexer;
        this.alertChecker = alertChecker;
    }

    @PostMapping
    public ResponseEntity<?> ingestLog(
            @RequestBody LogEntry logEntry
    ) {

        try {

            // 1. Validate/process the incoming log
            LogEntry processedLog =
                    processingService.processLog(logEntry);

            // 2. Index the log into Lucene
            logIndexer.indexLog(processedLog);

            // 3. Check the real log against alert rules
            alertChecker.checkLog(processedLog);

            return ResponseEntity.ok(
                    new LogResponse(
                            "Log received successfully",
                            true
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(
                            new LogResponse(
                                    e.getMessage(),
                                    false
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            new LogResponse(
                                    "Failed to process log: "
                                            + e.getMessage(),
                                    false
                            )
                    );
        }
    }

    public record LogResponse(
            String message,
            boolean success
    ) {
    }
}