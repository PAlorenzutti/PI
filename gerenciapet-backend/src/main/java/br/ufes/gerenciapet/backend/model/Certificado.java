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

import br.ufes.gerenciapet.backend.utils.enums.TipoCertificado;

@Entity
public class Certificado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String codigoValidacao;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataEmissao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCertificado tipo;

    @OneToOne
    @JoinColumn(name = "inscricao_id")
    private Inscricao inscricao;

    public Certificado() {}

    public void gerarDocumentoPdf() {
        // Implementação futura
    }

    public void validarAutenticidade() {
        // Implementação futura
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoValidacao() { return codigoValidacao; }
    public void setCodigoValidacao(String codigoValidacao) { this.codigoValidacao = codigoValidacao; }
    public Date getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(Date dataEmissao) { this.dataEmissao = dataEmissao; }
    public TipoCertificado getTipo() { return tipo; }
    public void setTipo(TipoCertificado tipo) { this.tipo = tipo; }
    public Inscricao getInscricao() { return inscricao; }
    public void setInscricao(Inscricao inscricao) { this.inscricao = inscricao; }
}
