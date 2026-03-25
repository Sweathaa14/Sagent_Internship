package com.habitquest.backend.controller;

import com.habitquest.backend.entity.Habit;
import com.habitquest.backend.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService service;

    @GetMapping
    public List<Habit> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Habit getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    @PostMapping
    public Habit create(@RequestBody Habit habit) {
        return service.save(habit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}