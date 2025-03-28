package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.Id;

import java.util.Optional;
import java.util.Set;

public interface Dao<ID extends Id<?>, DOMAIN extends HasId<ID>> {
    Set<DOMAIN> getAll();

    DOMAIN get(ID id);

    Set<DOMAIN> getIn(ID... ids);

    Optional<DOMAIN> find(ID id);

    void delete(ID id);

    void delete(DOMAIN domain);

    DOMAIN persist(DOMAIN domain);

    DOMAIN update(DOMAIN domain);

    Long count();
}
