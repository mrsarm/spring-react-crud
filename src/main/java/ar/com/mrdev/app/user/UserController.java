package ar.com.mrdev.app.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	@Autowired UserRepository userRepository;

	/**
	 * To update the profile without modifying the
	 * password (if it's not provided) and the
	 * user roles
	 */
	@PutMapping("/api/users/{id}/profile")
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	public User updateProfile(@PathVariable Long id, @Validated @RequestBody User user) {
		User userEntity = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (!userEntity.getId().equals(id)) {
			throw new IllegalArgumentException("Email only editable by manager users");
		}
		if (user.getPassword()!=null) {
			userEntity.setAlreadyEncodedPassword(user.getPassword());
		}
		userEntity.setFirstName(user.getFirstName());
		userEntity.setLastName(user.getLastName());
		userEntity.setDescription(user.getDescription());
		return userRepository.save(userEntity);
	}
}
