package com.aa.msw.gen.api;

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
 * ApiRegisterUserInformation
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-06-17T11:38:32.410629500+02:00[Europe/Zurich]", comments = "Generator version: 7.5.0")
public class ApiRegisterUserInformation {

  private String email;

  private String extId;

  public ApiRegisterUserInformation email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
  */
  @jakarta.validation.constraints.Email 
  @Schema(name = "email", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public ApiRegisterUserInformation extId(String extId) {
    this.extId = extId;
    return this;
  }

  /**
   * Get extId
   * @return extId
  */
  
  @Schema(name = "extId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("extId")
  public String getExtId() {
    return extId;
  }

  public void setExtId(String extId) {
    this.extId = extId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApiRegisterUserInformation apiRegisterUserInformation = (ApiRegisterUserInformation) o;
    return Objects.equals(this.email, apiRegisterUserInformation.email) &&
        Objects.equals(this.extId, apiRegisterUserInformation.extId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(email, extId);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApiRegisterUserInformation {\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    extId: ").append(toIndentedString(extId)).append("\n");
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

