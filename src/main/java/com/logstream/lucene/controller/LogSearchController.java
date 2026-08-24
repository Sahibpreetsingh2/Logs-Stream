package com.logstream.lucene.controller;

import com.logstream.lucene.search.LogSearcher;

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

        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Query parameter 'keyword' must not be blank"));
        }

        int boundedMax = Math.min(Math.max(maxResults, 1), 100); // clamp to [1, 100]

        try {
            List<LogSearcher.LogSearchResult> results = searchService.search(keyword, boundedMax);
            return ResponseEntity.ok(results);
        } catch (LogSearcher.LogSearchException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Search failed: " + e.getMessage()));
        }
    }

    /** Simple error payload for failed requests. */
    public record ErrorResponse(String error) {
    }
}