package com.logstream.backend.controller;

import com.logstream.backend.statistics.LogStatistics;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/logs/statistics")
public class LogStatisticsController {

    private final LogStatistics statistics;

    public LogStatisticsController(LogStatistics statistics) {
        this.statistics = statistics;
    }

    // GET /api/logs/statistics
    @GetMapping
    public ResponseEntity<Map<String, Object>> getStatistics() {

        Map<String, Object> response = Map.of(
                "totalLogsProcessed",
                statistics.getTotalLogsProcessed(),

                "totalLogsIndexed",
                statistics.getTotalLogsIndexed(),

                "totalLogsFailed",
                statistics.getTotalLogsFailed(),

                "averageProcessingTimeMs",
                statistics.getAverageProcessingTimeMs(),

                "throughputPerSecond",
                statistics.getThroughputPerSecond(),

                "countsByLevel",
                statistics.getCountsByLevel()
        );

        return ResponseEntity.ok(response);
    }

    // GET /api/logs/statistics/level/ERROR
    @GetMapping("/level/{level}")
    public ResponseEntity<Map<String, Object>> getLevelStatistics(
            @PathVariable String level) {

        long count = statistics.getCountForLevel(level);

        return ResponseEntity.ok(
                Map.of(
                        "level", level.toUpperCase(),
                        "count", count
                )
        );
    }

    // POST /api/logs/statistics/reset
    @PostMapping("/reset")
    public ResponseEntity<String> resetStatistics() {

        statistics.reset();

        return ResponseEntity.ok(
                "Log statistics reset successfully"
        );
    }
}