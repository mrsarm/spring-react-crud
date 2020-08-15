package ar.com.mrdev.app.task;

import ar.com.mrdev.app.user.User;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.*;
import static ar.com.mrdev.app.Constants.*;


@Data
@Entity(name = "tasks")
public class Task {

	private @Id @GeneratedValue
	Long id;

	@NotNull @Size(min = 4, max = SIZE_DESCRIPTION)
	@Column(length = SIZE_DESCRIPTION)
	private String name;

	@Size(max = SIZE_LONG_DESCRIPTION)
	@Column(length = SIZE_LONG_DESCRIPTION)
	private String description;

	@ManyToOne
	private User owner;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.DRAFT;

	public enum Status {
		DRAFT, OPEN, IN_PROGRESS, CLOSED, DONE;
	}
}
