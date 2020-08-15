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

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	final UserRepository userRepository;

	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	public User updateProfile(Long id, User user, boolean updateAsManager) {
		User userEntity = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (updateAsManager) {
			// Only Manager can edit roles
			if (user.getRoles()!=null) {
				userEntity.setRoles(user.getRoles());
			}
		}
		if (user.getPassword() != null) {
			userEntity.setAlreadyEncodedPassword(user.getPassword());
		}
		userEntity.setEmail(user.getEmail());
		userEntity.setFirstName(user.getFirstName());
		userEntity.setLastName(user.getLastName());
		userEntity.setDescription(user.getDescription());
		return userRepository.save(userEntity);
	}

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
}
