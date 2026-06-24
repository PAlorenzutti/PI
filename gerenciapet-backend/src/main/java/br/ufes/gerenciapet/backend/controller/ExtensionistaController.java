package br.ufes.gerenciapet.backend.controller;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import br.ufes.gerenciapet.backend.model.Extensionista;
import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.model.GrupoPet;
import br.ufes.gerenciapet.backend.repository.ExtensionistaRepository;
import br.ufes.gerenciapet.backend.repository.UserRepository;

@Controller
public class ExtensionistaController {

    @Autowired
    ExtensionistaRepository extensionistaRepo;

    @Autowired
    UserRepository userRepo;

    @DeleteMapping("/api/extensionista/{id}")
    @Transactional
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Optional<Extensionista> extOptional = extensionistaRepo.findById(id);

        if (extOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Extensionista not found");
        }

        Extensionista extensionista = extOptional.get();

        // Remove association with GrupoPet to prevent cascading issues
        GrupoPet grupoPet = extensionista.getGrupoPet();
        if (grupoPet != null) {
            grupoPet.getMembros().remove(extensionista);
        }

        if (extensionistaRepo.existsById(id)) {
            extensionistaRepo.deleteById(id);
        }

        return ResponseEntity.noContent().build();
    }
}
