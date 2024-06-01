package com.aa.msw.config;

public record Spot (
		String name,
		Integer stationId,
		Integer minFlow,
		Integer maxFlow
		) {}
