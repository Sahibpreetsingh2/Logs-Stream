package com.logstream.lucene.statistics;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Map;

/**
 * Thread-safe collector for log processing/indexing statistics.
 */
public class LogStatistics {

    private final AtomicLong totalLogsProcessed = new AtomicLong(0);
    private final AtomicLong totalLogsIndexed = new AtomicLong(0);
    private final AtomicLong totalLogsFailed = new AtomicLong(0);
    private final AtomicLong totalProcessingTimeMs = new AtomicLong(0);

    private final Map<String, AtomicLong> countsByLevel = new ConcurrentHashMap<>();
    private final long startTime = System.currentTimeMillis();

    /** Record a successfully processed and indexed log entry. */
    public void recordIndexed(String level, long processingTimeMs) {
        totalLogsProcessed.incrementAndGet();
        totalLogsIndexed.incrementAndGet();
        totalProcessingTimeMs.addAndGet(processingTimeMs);
        incrementLevel(level);
    }

    /** Record a log entry that failed to process/index. */
    public void recordFailed(String level) {
        totalLogsProcessed.incrementAndGet();
        totalLogsFailed.incrementAndGet();
        incrementLevel(level);
    }

    private void incrementLevel(String level) {
        String key = (level == null) ? "UNKNOWN" : level.toUpperCase();
        countsByLevel.computeIfAbsent(key, k -> new AtomicLong(0)).incrementAndGet();
    }

    public long getTotalLogsProcessed() {
        return totalLogsProcessed.get();
    }

    public long getTotalLogsIndexed() {
        return totalLogsIndexed.get();
    }

    public long getTotalLogsFailed() {
        return totalLogsFailed.get();
    }

    public double getAverageProcessingTimeMs() {
        long processed = totalLogsIndexed.get();
        return processed == 0 ? 0.0 : (double) totalProcessingTimeMs.get() / processed;
    }

    public long getCountForLevel(String level) {
        AtomicLong count = countsByLevel.get(level == null ? "UNKNOWN" : level.toUpperCase());
        return count == null ? 0 : count.get();
    }

    public Map<String, Long> getCountsByLevel() {
        Map<String, Long> snapshot = new ConcurrentHashMap<>();
        countsByLevel.forEach((k, v) -> snapshot.put(k, v.get()));
        return snapshot;
    }

    public double getThroughputPerSecond() {
        long elapsedSeconds = (System.currentTimeMillis() - startTime) / 1000;
        return elapsedSeconds == 0 ? 0.0 : (double) totalLogsProcessed.get() / elapsedSeconds;
    }

    public void reset() {
        totalLogsProcessed.set(0);
        totalLogsIndexed.set(0);
        totalLogsFailed.set(0);
        totalProcessingTimeMs.set(0);
        countsByLevel.clear();
    }

    @Override
    public String toString() {
        return String.format(
                "LogStatistics{processed=%d, indexed=%d, failed=%d, avgTimeMs=%.2f, throughput/s=%.2f, byLevel=%s}",
                getTotalLogsProcessed(), getTotalLogsIndexed(), getTotalLogsFailed(),
                getAverageProcessingTimeMs(), getThroughputPerSecond(), getCountsByLevel()
        );
    }
}