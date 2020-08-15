/*
 * Copyright 2015-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package ar.com.mrdev.app.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.List;
import static ar.com.mrdev.app.Constants.*;
import static javax.validation.constraints.Pattern.Flag.CASE_INSENSITIVE;


@Data
@ToString(exclude = {"password", "clearPassword"})
@Entity(name = "users")
public class User {

	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	// Add more roles here (TODO: move roles to a enum class)
	public static final String ROLE_MANAGER = "ROLE_MANAGER";
	public static final List<String> ROLES = Arrays.asList(ROLE_MANAGER);

	private @Id @GeneratedValue
	Long id;

	private @NotNull @Size(min = 3, max = SIZE_FIELD) String firstName;
	private @NotNull @Size(min = 0, max = SIZE_FIELD) String lastName;
	private @Size(min = 0, max = SIZE_DESCRIPTION) String description;

	@Column(unique=true)
	@Pattern(regexp = EMAIL_REGEXP, flags = CASE_INSENSITIVE, message="Invalid email address")
	private @NotNull @Size(min = 3, max = 50) String email;

	private @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	String password;

	@JsonIgnore @Transient @Getter(AccessLevel.NONE) @Setter(AccessLevel.NONE)
	private transient String clearPassword;

	private String[] roles = new String[] {};

	public User() {}

	public User(String email, String firstName, String lastName, String description, String password, String... roles) {
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.description = description;
		this.setPassword(password);
		this.roles = roles;
	}

	@AssertTrue(message = "size must be between 4 and 16")
	public boolean hasRightSizePassword() {
		return  clearPassword ==null || (clearPassword.length()>=4 && clearPassword.length()<=16);
	}

	public void setPassword(String password) {
		this.clearPassword = password;
		this.password = PASSWORD_ENCODER.encode(password);
	}

	@JsonIgnore @Transient
	public void setAlreadyEncodedPassword(String password) {
		this.clearPassword = null;
		this.password = password;
	}
}
