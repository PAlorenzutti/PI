package br.ufes.gerenciapet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import br.ufes.gerenciapet.backend.model.Tutor;

import org.springframework.data.repository.query.Param;

@CrossOrigin(origins = "http://localhost:4203")
@RepositoryRestResource(collectionResourceRel = "tutor", path = "tutor")
public interface TutorRepository extends JpaRepository<Tutor, Long> {
    Tutor findByUserEmail(@Param("email") String email);
}
