package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConsumableRepository : JpaRepository<Consumable, Int>, ConsumableRepositoryCustom {
    fun findConsumableByCsss(csss: Int) : Consumable?
}