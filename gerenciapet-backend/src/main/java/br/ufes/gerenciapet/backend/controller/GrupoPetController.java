package br.ufes.gerenciapet.backend.controller;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import br.ufes.gerenciapet.backend.model.GrupoPet;
import br.ufes.gerenciapet.backend.model.Tutor;
import br.ufes.gerenciapet.backend.repository.GrupoPetRepository;
import br.ufes.gerenciapet.backend.repository.TutorRepository;

@Controller
public class GrupoPetController {

    @Autowired
    GrupoPetRepository grupoPetRepo;

    @Autowired
    TutorRepository tutorRepo;

    @DeleteMapping("/api/grupoPet/delete/{id}")
    @Transactional
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Optional<GrupoPet> grupoPetOptional = grupoPetRepo.findById(id);

        if (grupoPetOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("GrupoPet not found");
        }

        GrupoPet grupoPet = grupoPetOptional.get();

        // Remove association with Tutor to prevent cascading issues
        Tutor tutor = grupoPet.getTutorCoordenador();
        if (tutor != null) {
            tutor.setGrupoPetCoordena(null);
            tutorRepo.save(tutor);
        }

        if (grupoPetRepo.existsById(id)) {
            grupoPetRepo.deleteById(id);
        }

        return ResponseEntity.noContent().build();
    }
}
