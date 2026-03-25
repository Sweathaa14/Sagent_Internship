package com.habitquest.backend.service;

import com.habitquest.backend.entity.User;
import com.habitquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public List<User> getAll() {
        return repo.findAll();
    }

    public User getOne(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public User save(User user) {
        return repo.save(user);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}