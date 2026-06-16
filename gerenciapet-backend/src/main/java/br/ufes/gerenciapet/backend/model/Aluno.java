package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Aluno extends User {

    @Column(nullable = true, length = 20)
    private String matricula;

    @OneToMany(mappedBy = "aluno")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Inscricao> inscricoes = new ArrayList<>();

    public Aluno() {}

    public void inscreverEmEvento(Evento evento) {
        // Implementação futura
    }

    public void baixarCertificado(Evento evento) {
        // Implementação futura
    }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public List<Inscricao> getInscricoes() { return inscricoes; }
    public void setInscricoes(List<Inscricao> inscricoes) { this.inscricoes = inscricoes; }
}
