package br.ufes.gerenciapet.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.ufes.gerenciapet.backend.model.User;

/**
 * Repositório de persistência para usuários.
 *
 * <p>Expõe consultas usadas pela API e pelo mecanismo de autenticação.</p>
 */
@RepositoryRestResource(collectionResourceRel="user", path="user")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    /**
     * Busca um usuário pelo endereço de email.
     *
     * @param email email único do usuário.
     * @return usuário encontrado ou {@code null} quando não houver cadastro.
     */
    User findByEmail(@Param("email") String email);

    /**
     * Busca usuários cujo nome contenha o trecho informado, ignorando
     * diferenças entre maiúsculas e minúsculas.
     *
     * @param nome trecho do nome usado na pesquisa.
     * @param pageable parâmetros de paginação.
     * @return página de usuários encontrados.
     */
    Page<User> findByNomeContainingIgnoreCase(@Param("nome") String nome, Pageable pageable);

    /**
     * Lista todos os usuários cadastrados.
     *
     * @return lista completa de usuários.
     */
    @Override
    List<User> findAll();

}
