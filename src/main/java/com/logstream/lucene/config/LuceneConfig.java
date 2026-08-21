package com.logstream.lucene.config;

import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Paths;

@Configuration
public class LuceneConfig {

    @Bean
    public Directory luceneDirectory() throws IOException {

        return FSDirectory.open(
                Paths.get("data/lucene-index")
        );
    }
}