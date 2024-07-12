package com.aa.msw.database.repository.dao;

import org.springframework.transaction.annotation.Transactional;

public interface TimestampedDao {
    @Transactional
    void deleteEventsOlderThanXDaysForEventType(int days);
}
