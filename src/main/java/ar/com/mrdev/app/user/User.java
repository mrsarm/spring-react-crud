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

//import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@ToString(exclude = "password")
@Entity
public class User {

	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	private @Id @GeneratedValue Long id;
	private String firstName;
	private String lastName;
	private String description;

	private String email;

	private @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	String password;

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

	public void setPassword(String password) {
		this.password = PASSWORD_ENCODER.encode(password);
	}
}
