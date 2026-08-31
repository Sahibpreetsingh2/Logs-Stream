package com.logstream.backend.controller;

import com.logstream.backend.search.LogSearcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogSearchController {

    private final LogSearcher searchService;

    public LogSearchController(LogSearcher searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "20") int maxResults) {

        // Validate keyword
        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(
                            "Query parameter 'keyword' must not be blank"
                    ));
        }

        // Validate result limit
        if (maxResults < 1 || maxResults > 100) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(
                            "maxResults must be between 1 and 100"
                    ));
        }

        try {

            List<LogSearcher.LogSearchResult> results =
                    searchService.search(keyword, maxResults);

            return ResponseEntity.ok(results);

        } catch (LogSearcher.LogSearchException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(
                            "Search failed: " + e.getMessage()
                    ));
        }
    }

    public record ErrorResponse(String error) {
    }
}