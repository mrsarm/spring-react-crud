package ar.com.mrdev.app.user;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder bCryptPasswordEncoder() {
		return User.PASSWORD_ENCODER;
	}

	@Bean
	public AuthenticationManager authenticationManager(
		HttpSecurity http,
		PasswordEncoder passwordEncoder,
		SpringDataJpaUserDetailsService userDetailsService
	) throws Exception {
		System.out.println(userDetailsService.toString());
		return http.getSharedObject(AuthenticationManagerBuilder.class)
			.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder)
			.and()
			.build();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf()
				.disable()
			.authorizeHttpRequests(requests -> requests
				.requestMatchers("/built/**").permitAll()
				.anyRequest().authenticated()
			)
			.formLogin(form -> form
				.defaultSuccessUrl("/", true)
				.permitAll()
			)
			.httpBasic(withDefaults())
			.logout(logout -> logout
				//.permitAll()
				.logoutSuccessUrl("/")
			);

		return http.build();
	}
}
