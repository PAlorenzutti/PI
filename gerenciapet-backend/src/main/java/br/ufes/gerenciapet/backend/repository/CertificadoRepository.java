package br.ufes.gerenciapet.backend.repository;

import br.ufes.gerenciapet.backend.model.Certificado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.repository.query.Param;
import java.util.List;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "certificados", path = "certificado")
public interface CertificadoRepository extends JpaRepository<Certificado, Long> {
    List<Certificado> findByUser_Id(@Param("userId") Long userId);
    List<Certificado> findByUser_Email(@Param("email") String email);
}
