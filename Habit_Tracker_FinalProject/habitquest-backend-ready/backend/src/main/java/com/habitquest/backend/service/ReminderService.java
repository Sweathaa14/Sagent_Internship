package com.habitquest.backend.service;

import com.habitquest.backend.entity.Reminder;
import com.habitquest.backend.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository repo;

    public List<Reminder> getAll() {
        return repo.findAll();
    }

    public Reminder getOne(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Reminder save(Reminder reminder) {
        return repo.save(reminder);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}