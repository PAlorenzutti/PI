package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.ufes.gerenciapet.backend.utils.enums.TipoCertificado;

/**
 * Entidade que representa um certificado emitido para uma inscrição.
 */
@Entity
public class Certificado {

    /**
     * Identificador único do certificado.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Código único usado para validação do certificado.
     */
    @Column(nullable = false, unique = true, length = 100)
    private String codigoValidacao;

    /**
     * Data em que o certificado foi emitido.
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataEmissao;

    /**
     * Tipo de certificado emitido.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCertificado tipo;

    /**
     * Inscrição que originou o certificado.
     */
    @OneToOne
    @JoinColumn(name = "inscricao_id")
    @JsonIgnore
    private Inscricao inscricao;

    /**
     * Retorna o identificador do certificado.
     *
     * @return identificador do certificado.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador do certificado.
     *
     * @param id identificador do certificado.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna o código de validação.
     *
     * @return código de validação.
     */
    public String getCodigoValidacao() { return codigoValidacao; }
    /**
     * Define o código de validação.
     *
     * @param codigoValidacao código de validação.
     */
    public void setCodigoValidacao(String codigoValidacao) { this.codigoValidacao = codigoValidacao; }
    /**
     * Retorna a data de emissão.
     *
     * @return data de emissão.
     */
    public Date getDataEmissao() { return dataEmissao; }
    /**
     * Define a data de emissão.
     *
     * @param dataEmissao data de emissão.
     */
    public void setDataEmissao(Date dataEmissao) { this.dataEmissao = dataEmissao; }
    /**
     * Retorna o tipo de certificado.
     *
     * @return tipo de certificado.
     */
    public TipoCertificado getTipo() { return tipo; }
    /**
     * Define o tipo de certificado.
     *
     * @param tipo tipo de certificado.
     */
    public void setTipo(TipoCertificado tipo) { this.tipo = tipo; }
    /**
     * Retorna a inscrição vinculada ao certificado.
     *
     * @return inscrição vinculada.
     */
    public Inscricao getInscricao() { return inscricao; }
    /**
     * Define a inscrição vinculada ao certificado.
     *
     * @param inscricao inscrição vinculada.
     */
    public void setInscricao(Inscricao inscricao) { this.inscricao = inscricao; }
}
