package br.ufes.gerenciapet.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.ufes.gerenciapet.backend.model.User;

@RepositoryRestResource(collectionResourceRel="user", path="user")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    User findByEmail(@Param("email") String email);

    Page<User> findByNomeContainingIgnoreCase(@Param("nome") String nome, Pageable pageable);

    @Override
    List<User> findAll();

}
