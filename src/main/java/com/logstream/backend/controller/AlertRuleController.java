package com.logstream.backend.controller;

import com.logstream.backend.alert.AlertRule;
import com.logstream.backend.alert.AlertRuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts/rules")
public class AlertRuleController {

    private final AlertRuleService alertRuleService;

    public AlertRuleController(
            AlertRuleService alertRuleService
    ) {
        this.alertRuleService = alertRuleService;
    }

    // CREATE RULE
    @PostMapping
    public ResponseEntity<?> createRule(
            @RequestBody AlertRuleRequest request
    ) {

        try {

            AlertRule rule = new AlertRule(
                    request.ruleName(),
                    request.threshold(),
                    request.windowSeconds(),
                    request.serviceName(),
                    request.level(),
                    request.notifyType()
            );

            AlertRule created =
                    alertRuleService.addRule(rule);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // GET ALL RULES
    @GetMapping
    public ResponseEntity<List<AlertRule>> getAllRules() {

        return ResponseEntity.ok(
                alertRuleService.getAllRules()
        );
    }

    // GET ONE RULE
    @GetMapping("/{ruleName}")
    public ResponseEntity<?> getRule(
            @PathVariable String ruleName
    ) {

        try {

            return ResponseEntity.ok(
                    alertRuleService.getRule(ruleName)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // UPDATE RULE
    @PutMapping("/{ruleName}")
    public ResponseEntity<?> updateRule(
            @PathVariable String ruleName,
            @RequestBody AlertRuleRequest request
    ) {

        try {

            AlertRule updatedRule = new AlertRule(
                    ruleName,
                    request.threshold(),
                    request.windowSeconds(),
                    request.serviceName(),
                    request.level(),
                    request.notifyType()
            );

            return ResponseEntity.ok(
                    alertRuleService.updateRule(
                            ruleName,
                            updatedRule
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // DELETE RULE
    @DeleteMapping("/{ruleName}")
    public ResponseEntity<?> deleteRule(
            @PathVariable String ruleName
    ) {

        try {

            return ResponseEntity.ok(
                    alertRuleService.deleteRule(ruleName)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    public record AlertRuleRequest(
            String ruleName,
            long threshold,
            long windowSeconds,
            String serviceName,
            String level,
            String notifyType
    ) {
    }

    public record ErrorResponse(
            String error
    ) {
    }
}