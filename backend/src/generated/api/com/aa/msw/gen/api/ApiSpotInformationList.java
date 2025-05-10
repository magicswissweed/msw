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

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2025-05-10T18:13:30.110862+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiSpotInformationList {

  @Valid
  private List<ApiSpotInformation> spots = new ArrayList<>();

  public ApiSpotInformationList() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public ApiSpotInformationList(List<ApiSpotInformation> spots) {
    this.spots = spots;
  }

  public ApiSpotInformationList spots(List<ApiSpotInformation> spots) {
    this.spots = spots;
    return this;
  }

  public ApiSpotInformationList addSpotsItem(ApiSpotInformation spotsItem) {
    if (this.spots == null) {
      this.spots = new ArrayList<>();
    }
    this.spots.add(spotsItem);
    return this;
  }

  /**
   * Get spots
   * @return spots
  */
  @NotNull @Valid 
  @Schema(name = "spots", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("spots")
  public List<ApiSpotInformation> getSpots() {
    return spots;
  }

  public void setSpots(List<ApiSpotInformation> spots) {
    this.spots = spots;
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
    return Objects.equals(this.spots, apiSpotInformationList.spots);
  }

  @Override
  public int hashCode() {
    return Objects.hash(spots);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiSpotInformationList {\n");
    sb.append("    spots: ").append(toIndentedString(spots)).append("\n");
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

