package com.habitquest.backend.controller;

import com.habitquest.backend.entity.Reminder;
import com.habitquest.backend.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService service;

    @GetMapping
    public List<Reminder> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Reminder getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    @PostMapping
    public Reminder create(@RequestBody Reminder reminder) {
        return service.save(reminder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}