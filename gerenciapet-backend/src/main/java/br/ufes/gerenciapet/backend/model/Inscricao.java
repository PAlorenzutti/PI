package br.ufes.gerenciapet.backend.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "evento_id")
    @JsonIgnore
    private Evento evento;

    @OneToOne(mappedBy = "inscricao", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Certificado certificado;

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
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Evento getEvento() { return evento; }
    public void setEvento(Evento evento) { this.evento = evento; }
    public Certificado getCertificado() { return certificado; }
    public void setCertificado(Certificado certificado) { this.certificado = certificado; }
}
