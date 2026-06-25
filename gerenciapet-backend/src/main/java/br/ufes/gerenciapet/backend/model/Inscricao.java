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

/**
 * Entidade que representa a inscrição de um usuário em um evento.
 */
@Entity
public class Inscricao {

    /**
     * Identificador único da inscrição.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Data em que a inscrição foi realizada.
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataInscricao;

    /**
     * Frequência registrada para o participante.
     */
    @Column(nullable = true)
    private Double frequencia;

    /**
     * Nota registrada para o participante.
     */
    @Column(nullable = true)
    private Double nota;

    /**
     * Status da inscrição no evento.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInscricao status;

    /**
     * Usuário inscrito no evento.
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Evento associado à inscrição.
     */
    @ManyToOne
    @JoinColumn(name = "evento_id")
    private Evento evento;

    /**
     * Certificado emitido para a inscrição.
     */
    @OneToOne(mappedBy = "inscricao", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Certificado certificado;

    /**
     * Retorna o identificador da inscrição.
     *
     * @return identificador da inscrição.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador da inscrição.
     *
     * @param id identificador da inscrição.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna a data da inscrição.
     *
     * @return data da inscrição.
     */
    public Date getDataInscricao() { return dataInscricao; }
    /**
     * Define a data da inscrição.
     *
     * @param dataInscricao data da inscrição.
     */
    public void setDataInscricao(Date dataInscricao) { this.dataInscricao = dataInscricao; }
    /**
     * Retorna a frequência do participante.
     *
     * @return frequência do participante.
     */
    public Double getFrequencia() { return frequencia; }
    /**
     * Define a frequência do participante.
     *
     * @param frequencia frequência do participante.
     */
    public void setFrequencia(Double frequencia) { this.frequencia = frequencia; }
    /**
     * Retorna a nota do participante.
     *
     * @return nota do participante.
     */
    public Double getNota() { return nota; }
    /**
     * Define a nota do participante.
     *
     * @param nota nota do participante.
     */
    public void setNota(Double nota) { this.nota = nota; }
    /**
     * Retorna o status da inscrição.
     *
     * @return status da inscrição.
     */
    public StatusInscricao getStatus() { return status; }
    /**
     * Define o status da inscrição.
     *
     * @param status status da inscrição.
     */
    public void setStatus(StatusInscricao status) { this.status = status; }
    /**
     * Retorna o usuário inscrito.
     *
     * @return usuário inscrito.
     */
    public User getUser() { return user; }
    /**
     * Define o usuário inscrito.
     *
     * @param user usuário inscrito.
     */
    public void setUser(User user) { this.user = user; }
    /**
     * Retorna o evento associado.
     *
     * @return evento associado.
     */
    public Evento getEvento() { return evento; }
    /**
     * Define o evento associado.
     *
     * @param evento evento associado.
     */
    public void setEvento(Evento evento) { this.evento = evento; }
    /**
     * Retorna o certificado emitido.
     *
     * @return certificado emitido.
     */
    public Certificado getCertificado() { return certificado; }
    /**
     * Define o certificado emitido.
     *
     * @param certificado certificado emitido.
     */
    public void setCertificado(Certificado certificado) { this.certificado = certificado; }
}
