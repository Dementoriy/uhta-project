package com.vyatsu.lukoilweb.models.application

import com.vyatsu.lukoilweb.models.Consumable
import jakarta.persistence.*

@Entity
@Table(name = "consumables_application")
class ApplicationConsumable(
    @EmbeddedId
    val consumableKey: ApplicationConsumableKey = ApplicationConsumableKey(),
    @ManyToOne(optional = false)
    @MapsId("consumableId")
    @JoinColumn(name = "consumables_id")
    val consumable: Consumable,

    @ManyToOne(optional = false)
    @MapsId("applicationNumber")
    @JoinColumn(name = "application_id")
    val application: Application,

    @Column(name = "material_count")
    val consumableCount: Int
){
    fun copy(
        consumableKey: ApplicationConsumableKey = this.consumableKey,
        consumable: Consumable = this.consumable,
        application: Application = this.application,
        consumableCount: Int = this.consumableCount
    ) : ApplicationConsumable{
        return ApplicationConsumable(consumableKey, consumable, application, consumableCount)
    }
}