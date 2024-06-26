package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Pageable

@Repository
interface UserRepository : JpaRepository<User, Int> {
    fun getUserByLoginAndPassword(login: String, password: String) : User?
    fun getUserByLogin(login: String) : User?
    fun findAllByIsDeletedFalseOrderByIdDesc(pageable: Pageable): List<User>
}