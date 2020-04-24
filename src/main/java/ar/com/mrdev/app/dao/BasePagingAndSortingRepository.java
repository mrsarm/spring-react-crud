package ar.com.mrdev.app.dao;


import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import java.io.Serializable;

@NoRepositoryBean
public interface BasePagingAndSortingRepository<T, I extends Serializable> extends PagingAndSortingRepository<T, I> {

}
