package com.logstream.lucene.search;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;

import org.apache.lucene.store.Directory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class LogSearcher{

    private final Directory directory;

    public LogSearcher(Directory directory) {
        this.directory = directory;
    }

    public List<String> search(String keyword)
            throws Exception {

        List<String> results = new ArrayList<>();

        StandardAnalyzer analyzer =
                new StandardAnalyzer();

        QueryParser parser =
                new QueryParser("message", analyzer);

        Query query =
                parser.parse(keyword);

        try (IndexReader reader =
                     DirectoryReader.open(directory)) {

            IndexSearcher searcher =
                    new IndexSearcher(reader);

            TopDocs topDocs =
                    searcher.search(query, 20);

            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {

                Document document =
                        searcher.doc(scoreDoc.doc);

                String message =
                        document.get("message");

                results.add(message);
            }
        }

        return results;
    }
}