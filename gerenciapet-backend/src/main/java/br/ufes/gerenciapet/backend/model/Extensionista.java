package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Entity
public class Extensionista extends Aluno {

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataIngresso;

    @Column(nullable = false)
    private Boolean bolsista;

    @ManyToOne
    @JoinColumn(name = "grupo_pet_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("membros")
    private GrupoPet grupoPet;

    public Extensionista() {}

    public void registrarFrequencia(Inscricao inscricao, Double presenca) {
        inscricao.setFrequencia(presenca);
    }

    public void lancarNota(Inscricao inscricao, Double nota) {
        inscricao.setNota(nota);
        inscricao.verificarAprovacao();
    }

    public Date getDataIngresso() { return dataIngresso; }
    public void setDataIngresso(Date dataIngresso) { this.dataIngresso = dataIngresso; }
    public Boolean getBolsista() { return bolsista; }
    public void setBolsista(Boolean bolsista) { this.bolsista = bolsista; }
    public GrupoPet getGrupoPet() { return grupoPet; }
    public void setGrupoPet(GrupoPet grupoPet) { this.grupoPet = grupoPet; }
}
