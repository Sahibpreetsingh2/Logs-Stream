package com.logstream.backend.lucene.config;

import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class LuceneConfig {

    @Bean
    public Directory luceneDirectory(
            @Value("${lucene.index.path:data/lucene-index}") String indexPath) throws IOException {

        Path path = Path.of(indexPath).toAbsolutePath().normalize();
        Files.createDirectories(path);

        return new CloseableFSDirectory(path);
    }

    /**
     * Wraps FSDirectory so Spring can call close() via DisposableBean
     * (compile-time checked) instead of relying on destroyMethod="close" reflection.
     */
    static class CloseableFSDirectory extends org.apache.lucene.store.FilterDirectory
            implements org.springframework.beans.factory.DisposableBean {

        CloseableFSDirectory(Path path) throws IOException {
            super(FSDirectory.open(path));
        }

        @Override
        public void destroy() throws Exception {
            close();
        }
    }
}