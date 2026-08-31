package com.logstream.backend.controller;


import com.logstream.backend.model.LogEntry;
import com.logstream.backend.service.LogProcessingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogProcessingService logProcessingService;

    public LogController(LogProcessingService logProcessingService) {
        this.logProcessingService = logProcessingService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Log Controller is working!");
    }

    @PostMapping
    public ResponseEntity<LogEntry> createLog(
            @RequestBody LogEntry logEntry) {

        LogEntry processedLog =
                logProcessingService.processLog(logEntry);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(processedLog);
    }
}