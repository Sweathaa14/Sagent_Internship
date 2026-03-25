package com.habitquest.backend.service;

import com.habitquest.backend.entity.Task;
import com.habitquest.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    public List<Task> getAll() {
        return repo.findAll();
    }

    public Task getOne(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Task save(Task task) {
        return repo.save(task);
    }

    public Task complete(Long id) {
        Task t = repo.findById(id).orElseThrow();
        t.setCompleted(true);
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}