package ar.com.mrdev.app;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
//TODO Remove DB context
public class AppApplicationTests {

	@Test
	public void contextLoads() {
	}

}
