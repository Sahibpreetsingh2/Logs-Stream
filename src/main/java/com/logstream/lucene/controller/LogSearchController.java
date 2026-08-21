package com.logstream.lucene.controller;

import com.logstream.lucene.search.LogSearcher;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogSearchController {

    private final LogSearcher searchService;

    public LogSearchController(
            LogSearcher searchService) {

        this.searchService = searchService;
    }

    @GetMapping("/search")
    public List<String> search(
            @RequestParam String keyword)
            throws Exception {

        return searchService.search(keyword);
    }
}
