package ar.com.mrdev.app.task;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;


@RepositoryRestResource
@PreAuthorize("isAuthenticated()")
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

}
