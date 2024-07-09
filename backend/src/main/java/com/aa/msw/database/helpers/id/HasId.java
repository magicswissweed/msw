package com.aa.msw.database.helpers.id;

public interface HasId<T extends Id<?>> {
    T getId();
}

