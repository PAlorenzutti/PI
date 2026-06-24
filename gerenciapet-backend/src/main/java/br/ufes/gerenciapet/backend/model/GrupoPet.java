package br.ufes.gerenciapet.backend.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um grupo PET.
 */
@Entity
public class GrupoPet {

    /**
     * Identificador único do grupo PET.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Sigla do grupo PET.
     */
    @Column(nullable = false, length = 100, unique = true)
    private String sigla;

    /**
     * Descrição do grupo PET.
     */
    @Column(nullable = false, length = 500)
    private String descricao;

    /**
     * Tutor coordenador do grupo PET.
     */
    @OneToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutorCoordenador;

    /**
     * Extensionistas membros do grupo PET.
     */
    @OneToMany(mappedBy = "grupoPet", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Extensionista> membros = new ArrayList<>();

    /**
     * Eventos organizados pelo grupo PET.
     */
    @OneToMany(mappedBy = "grupoPet")
    @JsonIgnore
    private List<Evento> eventos = new ArrayList<>();

    /**
     * Retorna o identificador do grupo PET.
     *
     * @return identificador do grupo PET.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador do grupo PET.
     *
     * @param id identificador do grupo PET.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna a sigla do grupo PET.
     *
     * @return sigla do grupo PET.
     */
    public String getSigla() { return sigla; }
    /**
     * Define a sigla do grupo PET.
     *
     * @param sigla sigla do grupo PET.
     */
    public void setSigla(String sigla) { this.sigla = sigla; }
    /**
     * Retorna a descrição do grupo PET.
     *
     * @return descrição do grupo PET.
     */
    public String getDescricao() { return descricao; }
    /**
     * Define a descrição do grupo PET.
     *
     * @param descricao descrição do grupo PET.
     */
    public void setDescricao(String descricao) { this.descricao = descricao; }
    /**
     * Retorna o tutor coordenador.
     *
     * @return tutor coordenador.
     */
    public Tutor getTutorCoordenador() { return tutorCoordenador; }
    /**
     * Define o tutor coordenador.
     *
     * @param tutorCoordenador tutor coordenador.
     */
    public void setTutorCoordenador(Tutor tutorCoordenador) { this.tutorCoordenador = tutorCoordenador; }
    /**
     * Retorna os membros do grupo PET.
     *
     * @return lista de extensionistas.
     */
    public List<Extensionista> getMembros() { return membros; }
    /**
     * Define os membros do grupo PET.
     *
     * @param membros lista de extensionistas.
     */
    public void setMembros(List<Extensionista> membros) { this.membros = membros; }
    /**
     * Retorna os eventos do grupo PET.
     *
     * @return lista de eventos.
     */
    public List<Evento> getEventos() { return eventos; }
    /**
     * Define os eventos do grupo PET.
     *
     * @param eventos lista de eventos.
     */
    public void setEventos(List<Evento> eventos) { this.eventos = eventos; }
}
