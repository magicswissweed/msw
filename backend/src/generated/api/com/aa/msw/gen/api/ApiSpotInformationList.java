package com.aa.msw.gen.api;

import java.net.URI;
import java.util.Objects;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * ApiSpotInformationList
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-06-21T11:04:37.180287600+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiSpotInformationList {

  @Valid
  private List<ApiSpotInformation> riverSurfSpots = new ArrayList<>();

  @Valid
  private List<ApiSpotInformation> bungeeSurfSpots = new ArrayList<>();

  public ApiSpotInformationList riverSurfSpots(List<ApiSpotInformation> riverSurfSpots) {
    this.riverSurfSpots = riverSurfSpots;
    return this;
  }

  public ApiSpotInformationList addRiverSurfSpotsItem(ApiSpotInformation riverSurfSpotsItem) {
    if (this.riverSurfSpots == null) {
      this.riverSurfSpots = new ArrayList<>();
    }
    this.riverSurfSpots.add(riverSurfSpotsItem);
    return this;
  }

  /**
   * Get riverSurfSpots
   * @return riverSurfSpots
  */
  @Valid 
  @Schema(name = "riverSurfSpots", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("riverSurfSpots")
  public List<ApiSpotInformation> getRiverSurfSpots() {
    return riverSurfSpots;
  }

  public void setRiverSurfSpots(List<ApiSpotInformation> riverSurfSpots) {
    this.riverSurfSpots = riverSurfSpots;
  }

  public ApiSpotInformationList bungeeSurfSpots(List<ApiSpotInformation> bungeeSurfSpots) {
    this.bungeeSurfSpots = bungeeSurfSpots;
    return this;
  }

  public ApiSpotInformationList addBungeeSurfSpotsItem(ApiSpotInformation bungeeSurfSpotsItem) {
    if (this.bungeeSurfSpots == null) {
      this.bungeeSurfSpots = new ArrayList<>();
    }
    this.bungeeSurfSpots.add(bungeeSurfSpotsItem);
    return this;
  }

  /**
   * Get bungeeSurfSpots
   * @return bungeeSurfSpots
  */
  @Valid 
  @Schema(name = "bungeeSurfSpots", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("bungeeSurfSpots")
  public List<ApiSpotInformation> getBungeeSurfSpots() {
    return bungeeSurfSpots;
  }

  public void setBungeeSurfSpots(List<ApiSpotInformation> bungeeSurfSpots) {
    this.bungeeSurfSpots = bungeeSurfSpots;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApiSpotInformationList apiSpotInformationList = (ApiSpotInformationList) o;
    return Objects.equals(this.riverSurfSpots, apiSpotInformationList.riverSurfSpots) &&
        Objects.equals(this.bungeeSurfSpots, apiSpotInformationList.bungeeSurfSpots);
  }

  @Override
  public int hashCode() {
    return Objects.hash(riverSurfSpots, bungeeSurfSpots);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiSpotInformationList {\n");
    sb.append("    riverSurfSpots: ").append(toIndentedString(riverSurfSpots)).append("\n");
    sb.append("    bungeeSurfSpots: ").append(toIndentedString(bungeeSurfSpots)).append("\n");
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

