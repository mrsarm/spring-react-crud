package ar.com.mrdev.app;

public interface Constants {

	String EMAIL_REGEXP =
		"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\."
			+ "[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"
			+ "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.?)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

	int SIZE_FIELD = 50;
	int SIZE_DESCRIPTION = 400;
}
