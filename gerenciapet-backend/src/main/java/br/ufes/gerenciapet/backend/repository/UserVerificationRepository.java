package br.ufes.gerenciapet.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.model.UserVerification;

public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {
    Optional<UserVerification> findByToken(String token);

    Optional<UserVerification> findByUserAndUsed(User user, boolean used);

}
