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
import org.springframework.stereotype.Component;
import java.util.stream.Stream;

@Component
@Slf4j
public class DatabaseLoader implements CommandLineRunner {

	private final UserRepository userRepository;

	@Autowired
	public DatabaseLoader(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		Stream.of(
			new User("Frodo", "Baggins", "Ring bearer"),
			new User("Bilbo", "Baggins", "Burglar"),
			new User("Gandalf", "the Grey", "Wizard"),
			new User("Legolas", "Greenleaf", "Elf prince"),
			new User("Sam", "Gamgee", "The gardener")
		).forEach(user -> {
			log.info("Created {}", this.userRepository.save(user));
		});
	}
}
