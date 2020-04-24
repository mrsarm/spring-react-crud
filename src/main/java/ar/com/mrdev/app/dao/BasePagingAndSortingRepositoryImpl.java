package ar.com.mrdev.app.dao;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import javax.persistence.EntityManager;
//import javax.persistence.TypedQuery;
//import javax.persistence.criteria.CriteriaBuilder;
//import javax.persistence.criteria.CriteriaQuery;
//import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.io.Serializable;


@NoRepositoryBean
@Slf4j
public class BasePagingAndSortingRepositoryImpl<T, ID extends Serializable>
	extends SimpleJpaRepository<T, ID> implements BasePagingAndSortingRepository<T, ID> {

	private EntityManager entityManager;

	@Autowired
	public BasePagingAndSortingRepositoryImpl(JpaEntityInformation<T, ?>
								  entityInformation, EntityManager entityManager) {
		super(entityInformation, entityManager);
		this.entityManager = entityManager;
	}


	// Override ar.com.mrdev.app.dao.BasePagingAndSortingRepositoryImpl logger configuration to avoid
	// logging each saved record, useful in development environments
	@Transactional
	public <S extends T> S save(S s) {
		this.log.info("Saving {}", s);
		S s2 = super.save(s);
		return s2;
	}

//	@Override
//	public T findByEmail(String email) {
//		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
//		CriteriaQuery<T> cQuery = builder.createQuery(getDomainClass());
//		Root<T> root = cQuery.from(getDomainClass());
//		cQuery
//			.select(root)
//			.where(builder
//				.like(root.<String>get("email"), "%" + email + "%"));
//		TypedQuery<T> query = entityManager.createQuery(cQuery);
//		return query.getSingleResult();
//	}
}
