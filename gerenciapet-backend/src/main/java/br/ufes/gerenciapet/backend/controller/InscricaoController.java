package br.ufes.gerenciapet.backend.controller;

import br.ufes.gerenciapet.backend.model.Evento;
import br.ufes.gerenciapet.backend.model.Inscricao;
import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.repository.EventoRepository;
import br.ufes.gerenciapet.backend.repository.InscricaoRepository;
import br.ufes.gerenciapet.backend.repository.UserRepository;
import br.ufes.gerenciapet.backend.utils.enums.StatusInscricao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/controle-inscricoes")
public class InscricaoController {

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/matricular")
    @Transactional
    public ResponseEntity<?> matricular(@RequestParam Long userId, @RequestParam Long eventoId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);

        if (!userOpt.isPresent() || !eventoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Usuário ou Evento não encontrado.");
        }

        Evento evento = eventoOpt.get();
        User user = userOpt.get();

        // Verifica se o usuário já está matriculado neste evento
        boolean jaMatriculado = evento.getInscricoes().stream()
                .anyMatch(inscricao -> inscricao.getUser().getId().equals(userId));

        if (jaMatriculado) {
            return ResponseEntity.badRequest().body("Você já está matriculado neste evento.");
        }

        if (evento.getVagasDisponiveis() <= 0) {
            return ResponseEntity.badRequest().body("Não há vagas disponíveis para este evento.");
        }

        Inscricao inscricao = new Inscricao();
        inscricao.setUser(user);
        inscricao.setEvento(evento);
        inscricao.setStatus(StatusInscricao.MATRICULADO);
        inscricao.setFrequencia(0.0);
        inscricao.setNota(0.0);
        inscricao.setDataInscricao(new Date());

        inscricaoRepository.save(inscricao);

        evento.setVagasDisponiveis(evento.getVagasDisponiveis() - 1);
        eventoRepository.save(evento);

        return ResponseEntity.ok(inscricao);
    }

    @DeleteMapping("/desmatricular/{id}")
    @Transactional
    public ResponseEntity<?> desmatricular(@PathVariable Long id) {
        Optional<Inscricao> inscricaoOpt = inscricaoRepository.findById(id);
        if (!inscricaoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Inscricao inscricao = inscricaoOpt.get();
        Evento evento = inscricao.getEvento();

        inscricaoRepository.delete(inscricao);

        if (evento != null) {
            evento.setVagasDisponiveis(evento.getVagasDisponiveis() + 1);
            eventoRepository.save(evento);
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("/atualizar-frequencia/{id}")
    @Transactional
    public ResponseEntity<?> atualizarFrequencia(@PathVariable Long id, @RequestBody FrequenciaRequest request) {
        Optional<Inscricao> inscricaoOpt = inscricaoRepository.findById(id);
        if (!inscricaoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Inscricao inscricao = inscricaoOpt.get();
        inscricao.setFrequencia(request.getFrequencia());
        inscricao.setDiasPresentes(request.getDiasPresentes());
        
        atualizarStatusInscricao(inscricao);
        
        inscricaoRepository.save(inscricao);
        
        return ResponseEntity.ok(inscricao);
    }

    @PutMapping("/atualizar-nota/{id}")
    @Transactional
    public ResponseEntity<?> atualizarNota(@PathVariable Long id, @RequestBody NotaRequest request) {
        Optional<Inscricao> inscricaoOpt = inscricaoRepository.findById(id);
        if (!inscricaoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Inscricao inscricao = inscricaoOpt.get();
        inscricao.setNota(request.getNota());
        
        atualizarStatusInscricao(inscricao);
        
        inscricaoRepository.save(inscricao);
        
        return ResponseEntity.ok(inscricao);
    }

    private void atualizarStatusInscricao(Inscricao inscricao) {
        Double nota = inscricao.getNota() != null ? inscricao.getNota() : 0.0;
        Double frequencia = inscricao.getFrequencia() != null ? inscricao.getFrequencia() : 0.0;

        if (nota >= 60.0 && frequencia >= 75.0) {
            inscricao.setStatus(StatusInscricao.APROVADO);
        } else {
            inscricao.setStatus(StatusInscricao.REPROVADO);
        }
    }

    static class FrequenciaRequest {
        private Double frequencia;
        private String diasPresentes;

        public Double getFrequencia() { return frequencia; }
        public void setFrequencia(Double frequencia) { this.frequencia = frequencia; }
        public String getDiasPresentes() { return diasPresentes; }
        public void setDiasPresentes(String diasPresentes) { this.diasPresentes = diasPresentes; }
    }

    static class NotaRequest {
        private Double nota;

        public Double getNota() { return nota; }
        public void setNota(Double nota) { this.nota = nota; }
    }
}
