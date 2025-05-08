package com.aa.msw.gen.api;

import java.net.URI;
import java.util.Objects;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiHistoricalYears;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.gen.api.ApiStation;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.UUID;
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

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2025-04-22T17:19:05.778666+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiSpotInformation {

  private UUID id;

  private String name;

  private Integer stationId;

  /**
   * Gets or Sets spotType
   */
  public enum SpotTypeEnum {
    RIVER_SURF("RIVER_SURF"),
    
    BUNGEE_SURF("BUNGEE_SURF");

    private String value;

    SpotTypeEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static SpotTypeEnum fromValue(String value) {
      for (SpotTypeEnum b : SpotTypeEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }

  private SpotTypeEnum spotType;

  private Boolean isPublic;

  private Integer minFlow;

  private Integer maxFlow;

  private ApiStation station;

  private ApiSample currentSample;

  private ApiForecast forecast;

  private ApiHistoricalYears historical;

  public ApiSpotInformation() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public ApiSpotInformation(UUID id, String name, Integer stationId, SpotTypeEnum spotType, Boolean isPublic, Integer minFlow, Integer maxFlow, ApiStation station, ApiSample currentSample, ApiForecast forecast, ApiHistoricalYears historical) {
    this.id = id;
    this.name = name;
    this.stationId = stationId;
    this.spotType = spotType;
    this.isPublic = isPublic;
    this.minFlow = minFlow;
    this.maxFlow = maxFlow;
    this.station = station;
    this.currentSample = currentSample;
    this.forecast = forecast;
    this.historical = historical;
  }

  public ApiSpotInformation id(UUID id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  */
  @NotNull @Valid 
  @Schema(name = "id", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("id")
  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public ApiSpotInformation name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  */
  @NotNull 
  @Schema(name = "name", requiredMode = Schema.RequiredMode.REQUIRED)
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
  @NotNull 
  @Schema(name = "stationId", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("stationId")
  public Integer getStationId() {
    return stationId;
  }

  public void setStationId(Integer stationId) {
    this.stationId = stationId;
  }

  public ApiSpotInformation spotType(SpotTypeEnum spotType) {
    this.spotType = spotType;
    return this;
  }

  /**
   * Get spotType
   * @return spotType
  */
  @NotNull 
  @Schema(name = "spotType", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("spotType")
  public SpotTypeEnum getSpotType() {
    return spotType;
  }

  public void setSpotType(SpotTypeEnum spotType) {
    this.spotType = spotType;
  }

  public ApiSpotInformation isPublic(Boolean isPublic) {
    this.isPublic = isPublic;
    return this;
  }

  /**
   * Get isPublic
   * @return isPublic
  */
  @NotNull 
  @Schema(name = "isPublic", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("isPublic")
  public Boolean getIsPublic() {
    return isPublic;
  }

  public void setIsPublic(Boolean isPublic) {
    this.isPublic = isPublic;
  }

  public ApiSpotInformation minFlow(Integer minFlow) {
    this.minFlow = minFlow;
    return this;
  }

  /**
   * Get minFlow
   * @return minFlow
  */
  @NotNull 
  @Schema(name = "minFlow", requiredMode = Schema.RequiredMode.REQUIRED)
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
  @NotNull 
  @Schema(name = "maxFlow", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("maxFlow")
  public Integer getMaxFlow() {
    return maxFlow;
  }

  public void setMaxFlow(Integer maxFlow) {
    this.maxFlow = maxFlow;
  }

  public ApiSpotInformation station(ApiStation station) {
    this.station = station;
    return this;
  }

  /**
   * Get station
   * @return station
  */
  @NotNull @Valid 
  @Schema(name = "station", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("station")
  public ApiStation getStation() {
    return station;
  }

  public void setStation(ApiStation station) {
    this.station = station;
  }

  public ApiSpotInformation currentSample(ApiSample currentSample) {
    this.currentSample = currentSample;
    return this;
  }

  /**
   * Get currentSample
   * @return currentSample
  */
  @NotNull @Valid 
  @Schema(name = "currentSample", requiredMode = Schema.RequiredMode.REQUIRED)
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
  @NotNull @Valid 
  @Schema(name = "forecast", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("forecast")
  public ApiForecast getForecast() {
    return forecast;
  }

  public void setForecast(ApiForecast forecast) {
    this.forecast = forecast;
  }

  public ApiSpotInformation historical(ApiHistoricalYears historical) {
    this.historical = historical;
    return this;
  }

  /**
   * Get historical
   * @return historical
  */
  @NotNull @Valid 
  @Schema(name = "historical", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("historical")
  public ApiHistoricalYears getHistorical() {
    return historical;
  }

  public void setHistorical(ApiHistoricalYears historical) {
    this.historical = historical;
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
    return Objects.equals(this.id, apiSpotInformation.id) &&
        Objects.equals(this.name, apiSpotInformation.name) &&
        Objects.equals(this.stationId, apiSpotInformation.stationId) &&
        Objects.equals(this.spotType, apiSpotInformation.spotType) &&
        Objects.equals(this.isPublic, apiSpotInformation.isPublic) &&
        Objects.equals(this.minFlow, apiSpotInformation.minFlow) &&
        Objects.equals(this.maxFlow, apiSpotInformation.maxFlow) &&
        Objects.equals(this.station, apiSpotInformation.station) &&
        Objects.equals(this.currentSample, apiSpotInformation.currentSample) &&
        Objects.equals(this.forecast, apiSpotInformation.forecast) &&
        Objects.equals(this.historical, apiSpotInformation.historical);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, stationId, spotType, isPublic, minFlow, maxFlow, station, currentSample, forecast, historical);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiSpotInformation {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    stationId: ").append(toIndentedString(stationId)).append("\n");
    sb.append("    spotType: ").append(toIndentedString(spotType)).append("\n");
    sb.append("    isPublic: ").append(toIndentedString(isPublic)).append("\n");
    sb.append("    minFlow: ").append(toIndentedString(minFlow)).append("\n");
    sb.append("    maxFlow: ").append(toIndentedString(maxFlow)).append("\n");
    sb.append("    station: ").append(toIndentedString(station)).append("\n");
    sb.append("    currentSample: ").append(toIndentedString(currentSample)).append("\n");
    sb.append("    forecast: ").append(toIndentedString(forecast)).append("\n");
    sb.append("    historical: ").append(toIndentedString(historical)).append("\n");
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

