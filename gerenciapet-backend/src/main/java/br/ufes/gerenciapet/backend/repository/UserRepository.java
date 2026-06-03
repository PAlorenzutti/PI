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

    List<User> findByRole(@Param("role") String role);

    User findByEmail(@Param("email") String email);

    User findByCpf(@Param("cpf") String cpf);

    Page<User> findByFullNameContaining(@Param("fullName") String fullName, Pageable pageable);

    @Override
    List<User> findAll();

}
