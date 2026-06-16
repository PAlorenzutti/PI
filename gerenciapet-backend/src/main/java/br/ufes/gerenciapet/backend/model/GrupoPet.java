package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GrupoPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String sigla;

    @Column(nullable = false, length = 500)
    private String descricao;

    @OneToOne
    @JoinColumn(name = "tutor_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("grupoPetCoordena")
    private Tutor tutorCoordenador;

    @OneToMany(mappedBy = "grupoPet")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Extensionista> membros = new ArrayList<>();

    @OneToMany(mappedBy = "grupoPet")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Evento> eventos = new ArrayList<>();

    public GrupoPet() {}

    public void adicionarMembro(Extensionista membro) {
        membros.add(membro);
        membro.setGrupoPet(this);
    }

    public void removerMembro(Extensionista membro) {
        membros.remove(membro);
        membro.setGrupoPet(null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSigla() { return sigla; }
    public void setSigla(String sigla) { this.sigla = sigla; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Tutor getTutorCoordenador() { return tutorCoordenador; }
    public void setTutorCoordenador(Tutor tutorCoordenador) { this.tutorCoordenador = tutorCoordenador; }
    public List<Extensionista> getMembros() { return membros; }
    public void setMembros(List<Extensionista> membros) { this.membros = membros; }
    public List<Evento> getEventos() { return eventos; }
    public void setEventos(List<Evento> eventos) { this.eventos = eventos; }
}
