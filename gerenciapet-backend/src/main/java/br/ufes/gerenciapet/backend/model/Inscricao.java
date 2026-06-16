package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

import br.ufes.gerenciapet.backend.utils.enums.StatusInscricao;

@Entity
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataInscricao;

    @Column(nullable = true)
    private Double frequencia;

    @Column(nullable = true)
    private Double nota;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInscricao status;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("inscricoes")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @OneToOne(mappedBy = "inscricao")
    private Certificado certificado;

    public Inscricao() {}

    public boolean verificarAprovacao() {
        if (this.frequencia != null && this.nota != null && this.frequencia >= 75.0 && this.nota >= 7.0) {
            this.status = StatusInscricao.APROVADO;
            return true;
        } else {
            this.status = StatusInscricao.REPROVADO;
            return false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Date getDataInscricao() { return dataInscricao; }
    public void setDataInscricao(Date dataInscricao) { this.dataInscricao = dataInscricao; }
    public Double getFrequencia() { return frequencia; }
    public void setFrequencia(Double frequencia) { this.frequencia = frequencia; }
    public Double getNota() { return nota; }
    public void setNota(Double nota) { this.nota = nota; }
    public StatusInscricao getStatus() { return status; }
    public void setStatus(StatusInscricao status) { this.status = status; }
    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
    public Evento getEvento() { return evento; }
    public void setEvento(Evento evento) { this.evento = evento; }
    public Certificado getCertificado() { return certificado; }
    public void setCertificado(Certificado certificado) { this.certificado = certificado; }
}
