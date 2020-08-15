/*
 * Copyright 2015-2020 the original author or authors.
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import static ar.com.mrdev.app.user.User.ROLE_MANAGER;


@RestController
public class UserController {

	@Autowired UserService userService;

	/**
	 * To update the profile without modifying the
	 * password (if it's not provided) and  without modifying the
	 * user roles (if the authenticated user isn't a Manager)
	 */
	@PutMapping("/api/users/{id}/profile")
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	public User updateProfile(HttpServletRequest request, @PathVariable Long id, @Validated @RequestBody User user) {
		return userService.updateProfile(id, user, request.isUserInRole(ROLE_MANAGER));
	}
}
