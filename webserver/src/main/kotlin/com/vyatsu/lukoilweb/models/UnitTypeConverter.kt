package com.vyatsu.lukoilweb.models

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.util.NoSuchElementException

@Converter
class UnitTypeConverter : AttributeConverter<UnitTypes, String> {
    override fun convertToDatabaseColumn(attribute: UnitTypes?): String {
        return attribute?.value ?: ""
    }

    override fun convertToEntityAttribute(dbData: String?): UnitTypes {
        return when (dbData){
            "ШТ" -> UnitTypes.PC
            "КМП" -> UnitTypes.ILC
            "М" -> UnitTypes.M
            "УПК" -> UnitTypes.UPC
            "КГ" -> UnitTypes.KG
            "Т" -> UnitTypes.T
            "М2" -> UnitTypes.M2
            else -> throw NoSuchElementException()
        }
    }
}