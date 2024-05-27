package com.aa.msw.database.helpers;

import com.aa.msw.database.helpers.id.Id;

import java.util.UUID;

public abstract class AbstractUUID extends Id<UUID> {
	public AbstractUUID (UUID identifier) {
		super(identifier);
	}
}
