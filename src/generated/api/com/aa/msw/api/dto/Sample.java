package com.aa.msw.api.dto;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Sample
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-05-24T11:09:05.410866300+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class Sample {

  private Double temperature;

  private Integer flow;

  public Sample temperature(Double temperature) {
    this.temperature = temperature;
    return this;
  }

  /**
   * Get temperature
   * @return temperature
  */
  
  @Schema(name = "temperature", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("temperature")
  public Double getTemperature() {
    return temperature;
  }

  public void setTemperature(Double temperature) {
    this.temperature = temperature;
  }

  public Sample flow(Integer flow) {
    this.flow = flow;
    return this;
  }

  /**
   * Get flow
   * @return flow
  */
  
  @Schema(name = "flow", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("flow")
  public Integer getFlow() {
    return flow;
  }

  public void setFlow(Integer flow) {
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
    Sample sample = (Sample) o;
    return Objects.equals(this.temperature, sample.temperature) &&
        Objects.equals(this.flow, sample.flow);
  }

  @Override
  public int hashCode() {
    return Objects.hash(temperature, flow);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Sample {\n");
    sb.append("    temperature: ").append(toIndentedString(temperature)).append("\n");
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

