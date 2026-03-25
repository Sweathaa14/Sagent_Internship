package com.habitquest.backend.service;

import com.habitquest.backend.entity.Habit;
import com.habitquest.backend.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository repo;

    public List<Habit> getAll() {
        return repo.findAll();
    }

    public Habit getOne(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Habit save(Habit habit) {
        return repo.save(habit);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}