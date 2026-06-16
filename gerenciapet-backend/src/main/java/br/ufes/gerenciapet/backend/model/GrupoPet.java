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
    private TutorCoordenador tutorCoordenador;

    @OneToMany(mappedBy = "grupoPet")
    private List<MembroPet> membros = new ArrayList<>();

    @OneToMany(mappedBy = "grupoPet")
    private List<Evento> eventos = new ArrayList<>();

    public GrupoPet() {}

    public void adicionarMembro(MembroPet membro) {
        membros.add(membro);
        membro.setGrupoPet(this);
    }

    public void removerMembro(MembroPet membro) {
        membros.remove(membro);
        membro.setGrupoPet(null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSigla() { return sigla; }
    public void setSigla(String sigla) { this.sigla = sigla; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public TutorCoordenador getTutorCoordenador() { return tutorCoordenador; }
    public void setTutorCoordenador(TutorCoordenador tutorCoordenador) { this.tutorCoordenador = tutorCoordenador; }
    public List<MembroPet> getMembros() { return membros; }
    public void setMembros(List<MembroPet> membros) { this.membros = membros; }
    public List<Evento> getEventos() { return eventos; }
    public void setEventos(List<Evento> eventos) { this.eventos = eventos; }
}
