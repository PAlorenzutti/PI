package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class CityBrazil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String name;

    @Column(nullable=false)
    private int ibge;

    @ManyToOne
    @JoinColumn(name = "uf") // Referencia ao campo 'uf' da tabela cidade
    private StateBrazil stateBrazil;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getIbge() {
        return ibge;
    }

    public void setIbge(int ibge) {
        this.ibge = ibge;
    }

    public StateBrazil getStateBrazil() {
        return stateBrazil;
    }

    public void setStateBrazil(StateBrazil stateBrazil) {
        this.stateBrazil = stateBrazil;
    }

    public Long getUf() {
        return stateBrazil != null ? stateBrazil.getId() : null;
    }
}
