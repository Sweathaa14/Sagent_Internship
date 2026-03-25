package com.habitquest.backend.repository;

import com.habitquest.backend.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {

    List<HabitLog> findByHabitIdOrderByDateDesc(Long habitId);

    List<HabitLog> findByHabitIdOrderByDateAsc(Long habitId);

    List<HabitLog> findByHabitId(Long habitId);
}