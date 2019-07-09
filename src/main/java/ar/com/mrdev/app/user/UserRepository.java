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

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Arrays;
import java.util.List;


interface UserRepositoryCustom {
	<U extends User> U save(U user);
}

@Slf4j
class UserRepositoryCustomImpl implements UserRepositoryCustom {

	final JpaEntityInformation<User, ?> entityInformation;
	EntityManager em;

	public UserRepositoryCustomImpl(EntityManager entityManager) {
		this.entityInformation = JpaEntityInformationSupport.getEntityInformation(User.class, entityManager);
		this.em = entityManager;
	}

	@Override
	@Transactional
	public <U extends User> U save(U user) {
		// Check roles are valid
		List<String> newRoles = Arrays.asList(user.getRoles());
		if (!User.ROLES.containsAll(newRoles)) {
			throw new IllegalArgumentException("Some user roles are invalid " + newRoles);
		}

		if (entityInformation.isNew(user)) {
			log.info("Creating new {}", user);
			if (user.getPassword()==null) {
				throw new IllegalArgumentException("Null password");
			}
			em.persist(user);
			return user;
		} else {
			log.info("Updating existent {}", user);
			return em.merge(user);
		}
	}
}




@RepositoryRestResource
public interface UserRepository extends PagingAndSortingRepository<User, Long>, UserRepositoryCustom {

	User findByEmail(String email);

	@Override
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	User save(@Param("user") User user);

	@Override
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	void deleteById(@Param("id") Long id);

	@Override
	@PreAuthorize("hasRole('ROLE_MANAGER') or #user?.email == authentication?.name")
	void delete(@Param("user") User user);
}
