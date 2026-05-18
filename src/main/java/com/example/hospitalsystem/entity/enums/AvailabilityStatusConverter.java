package com.example.hospitalsystem.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AvailabilityStatusConverter implements AttributeConverter<AvailabilityStatus, String> {

    @Override
    public String convertToDatabaseColumn(AvailabilityStatus attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }

    @Override
    public AvailabilityStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AvailabilityStatus.fromDbValue(dbData);
    }
}
