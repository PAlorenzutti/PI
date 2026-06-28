package br.ufes.gerenciapet.backend.controller;

import br.ufes.gerenciapet.backend.model.Certificado;
import br.ufes.gerenciapet.backend.model.Extensionista;
import br.ufes.gerenciapet.backend.model.Inscricao;
import br.ufes.gerenciapet.backend.repository.CertificadoRepository;
import br.ufes.gerenciapet.backend.repository.ExtensionistaRepository;
import br.ufes.gerenciapet.backend.repository.InscricaoRepository;
import br.ufes.gerenciapet.backend.utils.enums.TipoCertificado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/controle-certificados")
public class CertificadoController {

    @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private ExtensionistaRepository extensionistaRepository;

    @PostMapping("/emitir-aluno/{inscricaoId}")
    @Transactional
    public ResponseEntity<?> emitirCertificadoAluno(@PathVariable Long inscricaoId) {
        Optional<Inscricao> inscricaoOpt = inscricaoRepository.findById(inscricaoId);
        if (!inscricaoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Inscricao inscricao = inscricaoOpt.get();

        // Verifica se já tem certificado
        if (inscricao.getCertificado() != null) {
            return ResponseEntity.badRequest().body("Inscrição já possui certificado emitido.");
        }

        Certificado cert = new Certificado();
        cert.setCodigoValidacao(UUID.randomUUID().toString());
        cert.setDataEmissao(new Date());
        cert.setTipo(TipoCertificado.HORAS_COMPLEMENTARES);
        cert.setInscricao(inscricao);
        
        // Associa também ao usuário para unificar a busca de certificados
        if (inscricao.getUser() != null) {
            cert.setUser(inscricao.getUser());
        }

        certificadoRepository.save(cert);
        
        inscricao.setCertificado(cert);
        inscricaoRepository.save(inscricao);

        return ResponseEntity.ok(cert);
    }

    @PostMapping("/emitir-extensionista/{extensionistaId}")
    @Transactional
    public ResponseEntity<?> emitirCertificadoExtensionista(@PathVariable Long extensionistaId) {
        Optional<Extensionista> extOpt = extensionistaRepository.findById(extensionistaId);
        if (!extOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Extensionista extensionista = extOpt.get();

        Certificado cert = new Certificado();
        cert.setCodigoValidacao(UUID.randomUUID().toString());
        cert.setDataEmissao(new Date());
        cert.setTipo(TipoCertificado.HORAS_EXTENSAO);
        cert.setUser(extensionista.getUser());

        certificadoRepository.save(cert);

        return ResponseEntity.ok(cert);
    }
}
