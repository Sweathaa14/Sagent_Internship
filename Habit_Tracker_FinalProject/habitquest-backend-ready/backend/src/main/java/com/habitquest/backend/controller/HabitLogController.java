package com.habitquest.backend.controller;

import com.habitquest.backend.entity.HabitLog;
import com.habitquest.backend.service.HabitLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class HabitLogController {

    private final HabitLogService service;

    @PostMapping
    public HabitLog log(@RequestBody HabitLog log) {
        return service.save(log);
    }

    @GetMapping("/habit/{id}/history")
    public List<HabitLog> history(@PathVariable Long id) {
        return service.getHistory(id);
    }

    @GetMapping("/habit/{id}/stats")
    public Map<String, Object> stats(@PathVariable Long id) {
        return Map.of(
                "currentStreak", service.currentStreak(id),
                "longestStreak", service.longestStreak(id),
                "completionRate", service.completionRate(id),
                "xp", service.xp(id)
        );
    }
}