package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DeviceRepository : JpaRepository<Device, Int>, DeviceRepositoryCustom {
    fun findAllByIsDeletedFalseOrderByIdDesc(pageable: Pageable): List<Device>
    fun findDeviceByCsssAndIsDeletedFalse(csss: Int): Device?
}