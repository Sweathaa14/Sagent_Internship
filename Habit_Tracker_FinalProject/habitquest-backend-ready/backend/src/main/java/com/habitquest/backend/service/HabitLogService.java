package com.habitquest.backend.service;

import com.habitquest.backend.entity.HabitLog;
import com.habitquest.backend.repository.HabitLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitLogService {

    private final HabitLogRepository repo;

    public HabitLog save(HabitLog log) {
        return repo.save(log);
    }

    public List<HabitLog> getHistory(Long habitId) {
        return repo.findByHabitIdOrderByDateAsc(habitId);
    }

    public int currentStreak(Long habitId) {
        List<HabitLog> logs = repo.findByHabitIdOrderByDateDesc(habitId);

        int streak = 0;
        LocalDate today = LocalDate.now();

        for (HabitLog log : logs) {
            if (log.isCompleted() && log.getDate().equals(today.minusDays(streak))) {
                streak++;
            } else break;
        }

        return streak;
    }

    public int longestStreak(Long habitId) {
        List<HabitLog> logs = repo.findByHabitIdOrderByDateAsc(habitId);

        int max = 0, current = 0;

        for (HabitLog log : logs) {
            if (log.isCompleted()) {
                current++;
                max = Math.max(max, current);
            } else current = 0;
        }

        return max;
    }

    public double completionRate(Long habitId) {
        List<HabitLog> logs = repo.findByHabitId(habitId);

        long total = logs.size();
        long completed = logs.stream().filter(HabitLog::isCompleted).count();

        return total == 0 ? 0 : (completed * 100.0) / total;
    }

    public int xp(Long habitId) {
        return (int) repo.findByHabitId(habitId)
                .stream()
                .filter(HabitLog::isCompleted)
                .count() * 10;
    }
}