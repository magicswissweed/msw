package com.aa.msw.gen.api;

import java.net.URI;
import java.util.Objects;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiSample;
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
 * ApiSpotInformation
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-06-10T10:47:58.279956800+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiSpotInformation {

  private String name;

  private Integer stationId;

  private Integer minFlow;

  private Integer maxFlow;

  private ApiSample currentSample;

  private ApiForecast forecast;

  public ApiSpotInformation name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  */
  
  @Schema(name = "name", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ApiSpotInformation stationId(Integer stationId) {
    this.stationId = stationId;
    return this;
  }

  /**
   * Get stationId
   * @return stationId
  */
  
  @Schema(name = "stationId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("stationId")
  public Integer getStationId() {
    return stationId;
  }

  public void setStationId(Integer stationId) {
    this.stationId = stationId;
  }

  public ApiSpotInformation minFlow(Integer minFlow) {
    this.minFlow = minFlow;
    return this;
  }

  /**
   * Get minFlow
   * @return minFlow
  */
  
  @Schema(name = "minFlow", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("minFlow")
  public Integer getMinFlow() {
    return minFlow;
  }

  public void setMinFlow(Integer minFlow) {
    this.minFlow = minFlow;
  }

  public ApiSpotInformation maxFlow(Integer maxFlow) {
    this.maxFlow = maxFlow;
    return this;
  }

  /**
   * Get maxFlow
   * @return maxFlow
  */
  
  @Schema(name = "maxFlow", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("maxFlow")
  public Integer getMaxFlow() {
    return maxFlow;
  }

  public void setMaxFlow(Integer maxFlow) {
    this.maxFlow = maxFlow;
  }

  public ApiSpotInformation currentSample(ApiSample currentSample) {
    this.currentSample = currentSample;
    return this;
  }

  /**
   * Get currentSample
   * @return currentSample
  */
  @Valid 
  @Schema(name = "currentSample", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("currentSample")
  public ApiSample getCurrentSample() {
    return currentSample;
  }

  public void setCurrentSample(ApiSample currentSample) {
    this.currentSample = currentSample;
  }

  public ApiSpotInformation forecast(ApiForecast forecast) {
    this.forecast = forecast;
    return this;
  }

  /**
   * Get forecast
   * @return forecast
  */
  @Valid 
  @Schema(name = "forecast", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("forecast")
  public ApiForecast getForecast() {
    return forecast;
  }

  public void setForecast(ApiForecast forecast) {
    this.forecast = forecast;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApiSpotInformation apiSpotInformation = (ApiSpotInformation) o;
    return Objects.equals(this.name, apiSpotInformation.name) &&
        Objects.equals(this.stationId, apiSpotInformation.stationId) &&
        Objects.equals(this.minFlow, apiSpotInformation.minFlow) &&
        Objects.equals(this.maxFlow, apiSpotInformation.maxFlow) &&
        Objects.equals(this.currentSample, apiSpotInformation.currentSample) &&
        Objects.equals(this.forecast, apiSpotInformation.forecast);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, stationId, minFlow, maxFlow, currentSample, forecast);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiSpotInformation {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    stationId: ").append(toIndentedString(stationId)).append("\n");
    sb.append("    minFlow: ").append(toIndentedString(minFlow)).append("\n");
    sb.append("    maxFlow: ").append(toIndentedString(maxFlow)).append("\n");
    sb.append("    currentSample: ").append(toIndentedString(currentSample)).append("\n");
    sb.append("    forecast: ").append(toIndentedString(forecast)).append("\n");
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

