package com.example.HospitalSystem.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BillStatusConverter implements AttributeConverter<BillStatus, String> {

    @Override
    public String convertToDatabaseColumn(BillStatus attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }

    @Override
    public BillStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : BillStatus.fromDbValue(dbData);
    }
}
