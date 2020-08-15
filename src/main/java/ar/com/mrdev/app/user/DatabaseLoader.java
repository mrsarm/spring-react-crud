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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.stream.Stream;
import static ar.com.mrdev.app.user.User.ROLE_MANAGER;


@Component
@Slf4j
public class DatabaseLoader implements CommandLineRunner {

	final UserRepository userRepository;
	final Environment env;

	@Override
	public void run(String... strings) throws Exception {

		if (userRepository.count() == 0l) {
			SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken("greg", "doesn't matter",
					AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

			Stream.of(
				new User("frodo@local", "Frodo", "Baggins", "Ring bearer", "admin", ROLE_MANAGER),
				new User("bilbo@local", "Bilbo", "Baggins", "Burglar", "test"),
				new User("gf@local", "Gandalf", "the Grey", "Wizard", "admin", ROLE_MANAGER),
				new User("lego@local", "Legolas", "Greenleaf", "Elf prince", "test"),
				new User("sam@local", "Sam", "Gamgee", "The gardener", "test")
			).forEach(user -> {
				log.info("Created {}", userRepository.save(user));
			});

			SecurityContextHolder.clearContext();
		} else {
			log.info("Creation of default users skipped");
		}
	}

	@Autowired
	public DatabaseLoader(
		UserRepository userRepository, Environment env) {
		this.userRepository = userRepository;
		this.env = env;
	}
}
