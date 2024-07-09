package com.aa.msw.database.helpers.id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

import java.io.Serializable;

public abstract class Id<T extends Serializable> implements Serializable {
    private final T identifier;
    private final String idStr;

    public Id(T identifier) {
        if (identifier == null) {
            throw new RuntimeException("ID with nullValues are not allowed!");
        }
        this.identifier = identifier;
        this.idStr = identifier.toString();
    }

    @JsonIgnore
    public String getIdentifier() {
        return idStr;
    }

    @JsonValue
    public T getId() {
        return identifier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Id id = (Id) o;

        return getIdentifier().equals(id.getIdentifier());
    }

    @Override
    public int hashCode() {
        return getIdentifier().hashCode();
    }

    @Override
    public String toString() {
        return getIdentifier();
    }
}
