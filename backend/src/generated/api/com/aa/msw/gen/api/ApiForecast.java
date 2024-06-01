package com.aa.msw.gen.api;

import java.net.URI;
import java.util.Objects;
import com.aa.msw.gen.api.ApiForecastLineEntry;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * ApiForecast
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-06-01T16:19:38.790291200+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiForecast {

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime timestamp;

  @Valid
  private List<@Valid ApiForecastLineEntry> measuredData = new ArrayList<>();

  @Valid
  private List<@Valid ApiForecastLineEntry> median = new ArrayList<>();

  @Valid
  private List<@Valid ApiForecastLineEntry> twentyFiveToSeventyFivePercentile = new ArrayList<>();

  @Valid
  private List<@Valid ApiForecastLineEntry> max = new ArrayList<>();

  @Valid
  private List<@Valid ApiForecastLineEntry> min = new ArrayList<>();

  public ApiForecast timestamp(OffsetDateTime timestamp) {
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

  public ApiForecast measuredData(List<@Valid ApiForecastLineEntry> measuredData) {
    this.measuredData = measuredData;
    return this;
  }

  public ApiForecast addMeasuredDataItem(ApiForecastLineEntry measuredDataItem) {
    if (this.measuredData == null) {
      this.measuredData = new ArrayList<>();
    }
    this.measuredData.add(measuredDataItem);
    return this;
  }

  /**
   * Get measuredData
   * @return measuredData
  */
  @Valid 
  @Schema(name = "measuredData", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("measuredData")
  public List<@Valid ApiForecastLineEntry> getMeasuredData() {
    return measuredData;
  }

  public void setMeasuredData(List<@Valid ApiForecastLineEntry> measuredData) {
    this.measuredData = measuredData;
  }

  public ApiForecast median(List<@Valid ApiForecastLineEntry> median) {
    this.median = median;
    return this;
  }

  public ApiForecast addMedianItem(ApiForecastLineEntry medianItem) {
    if (this.median == null) {
      this.median = new ArrayList<>();
    }
    this.median.add(medianItem);
    return this;
  }

  /**
   * Get median
   * @return median
  */
  @Valid 
  @Schema(name = "median", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("median")
  public List<@Valid ApiForecastLineEntry> getMedian() {
    return median;
  }

  public void setMedian(List<@Valid ApiForecastLineEntry> median) {
    this.median = median;
  }

  public ApiForecast twentyFiveToSeventyFivePercentile(List<@Valid ApiForecastLineEntry> twentyFiveToSeventyFivePercentile) {
    this.twentyFiveToSeventyFivePercentile = twentyFiveToSeventyFivePercentile;
    return this;
  }

  public ApiForecast addTwentyFiveToSeventyFivePercentileItem(ApiForecastLineEntry twentyFiveToSeventyFivePercentileItem) {
    if (this.twentyFiveToSeventyFivePercentile == null) {
      this.twentyFiveToSeventyFivePercentile = new ArrayList<>();
    }
    this.twentyFiveToSeventyFivePercentile.add(twentyFiveToSeventyFivePercentileItem);
    return this;
  }

  /**
   * Get twentyFiveToSeventyFivePercentile
   * @return twentyFiveToSeventyFivePercentile
  */
  @Valid 
  @Schema(name = "twentyFiveToSeventyFivePercentile", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("twentyFiveToSeventyFivePercentile")
  public List<@Valid ApiForecastLineEntry> getTwentyFiveToSeventyFivePercentile() {
    return twentyFiveToSeventyFivePercentile;
  }

  public void setTwentyFiveToSeventyFivePercentile(List<@Valid ApiForecastLineEntry> twentyFiveToSeventyFivePercentile) {
    this.twentyFiveToSeventyFivePercentile = twentyFiveToSeventyFivePercentile;
  }

  public ApiForecast max(List<@Valid ApiForecastLineEntry> max) {
    this.max = max;
    return this;
  }

  public ApiForecast addMaxItem(ApiForecastLineEntry maxItem) {
    if (this.max == null) {
      this.max = new ArrayList<>();
    }
    this.max.add(maxItem);
    return this;
  }

  /**
   * Get max
   * @return max
  */
  @Valid 
  @Schema(name = "max", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("max")
  public List<@Valid ApiForecastLineEntry> getMax() {
    return max;
  }

  public void setMax(List<@Valid ApiForecastLineEntry> max) {
    this.max = max;
  }

  public ApiForecast min(List<@Valid ApiForecastLineEntry> min) {
    this.min = min;
    return this;
  }

  public ApiForecast addMinItem(ApiForecastLineEntry minItem) {
    if (this.min == null) {
      this.min = new ArrayList<>();
    }
    this.min.add(minItem);
    return this;
  }

  /**
   * Get min
   * @return min
  */
  @Valid 
  @Schema(name = "min", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("min")
  public List<@Valid ApiForecastLineEntry> getMin() {
    return min;
  }

  public void setMin(List<@Valid ApiForecastLineEntry> min) {
    this.min = min;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApiForecast apiForecast = (ApiForecast) o;
    return Objects.equals(this.timestamp, apiForecast.timestamp) &&
        Objects.equals(this.measuredData, apiForecast.measuredData) &&
        Objects.equals(this.median, apiForecast.median) &&
        Objects.equals(this.twentyFiveToSeventyFivePercentile, apiForecast.twentyFiveToSeventyFivePercentile) &&
        Objects.equals(this.max, apiForecast.max) &&
        Objects.equals(this.min, apiForecast.min);
  }

  @Override
  public int hashCode() {
    return Objects.hash(timestamp, measuredData, median, twentyFiveToSeventyFivePercentile, max, min);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiForecast {\n");
    sb.append("    timestamp: ").append(toIndentedString(timestamp)).append("\n");
    sb.append("    measuredData: ").append(toIndentedString(measuredData)).append("\n");
    sb.append("    median: ").append(toIndentedString(median)).append("\n");
    sb.append("    twentyFiveToSeventyFivePercentile: ").append(toIndentedString(twentyFiveToSeventyFivePercentile)).append("\n");
    sb.append("    max: ").append(toIndentedString(max)).append("\n");
    sb.append("    min: ").append(toIndentedString(min)).append("\n");
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

