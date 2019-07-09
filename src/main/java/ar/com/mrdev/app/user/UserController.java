package ar.com.mrdev.app.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;


@RestController
public class UserController {

	@Autowired UserRepository userRepository;

	/**
	 * To update the profile without modifying the
	 * password (if it's not provided) and  without modifying the
	 * user roles (if the authenticated user isn't a Manager)
	 */
	@PutMapping("/api/users/{id}/profile")
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	public User updateProfile(HttpServletRequest request, @PathVariable Long id, @Validated @RequestBody User user) {
		User userEntity = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (request.isUserInRole("ROLE_MANAGER")) {
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
}
