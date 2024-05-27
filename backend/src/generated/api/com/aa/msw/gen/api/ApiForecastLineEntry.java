package com.aa.msw.gen.api;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.media.Schema;


import jakarta.annotation.Generated;

/**
 * ApiForecastLineEntry
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-05-26T22:47:00.494278100+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiForecastLineEntry {

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime timestamp;

  private Double flow;

  public ApiForecastLineEntry timestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Get timestamp
   * @return timestamp
  */
  @Valid 
  @Schema(name = "timestamp", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("timestamp")
  public OffsetDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public ApiForecastLineEntry flow(Double flow) {
    this.flow = flow;
    return this;
  }

  /**
   * Get flow
   * @return flow
  */
  
  @Schema(name = "flow", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("flow")
  public Double getFlow() {
    return flow;
  }

  public void setFlow(Double flow) {
    this.flow = flow;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApiForecastLineEntry apiForecastLineEntry = (ApiForecastLineEntry) o;
    return Objects.equals(this.timestamp, apiForecastLineEntry.timestamp) &&
        Objects.equals(this.flow, apiForecastLineEntry.flow);
  }

  @Override
  public int hashCode() {
    return Objects.hash(timestamp, flow);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiForecastLineEntry {\n");
    sb.append("    timestamp: ").append(toIndentedString(timestamp)).append("\n");
    sb.append("    flow: ").append(toIndentedString(flow)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

