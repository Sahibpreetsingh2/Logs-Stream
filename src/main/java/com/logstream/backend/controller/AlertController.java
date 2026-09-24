package com.logstream.backend.controller;

import com.logstream.backend.alert.AlertChecker;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertChecker alertChecker;

    public AlertController(
            AlertChecker alertChecker
    ) {
        this.alertChecker = alertChecker;
    }

    @GetMapping
    public ResponseEntity<List<AlertChecker.ActiveAlert>>
    getTriggeredAlerts() {

        return ResponseEntity.ok(
                alertChecker.getActiveAlerts()
        );
    }
}