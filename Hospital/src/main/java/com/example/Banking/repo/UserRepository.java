package com.example.Banking.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Banking.entity.User;

public interface UserRepository extends JpaRepository<User,Integer> {

}
