package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

/**
 * Entidade que representa um extensionista vinculado a um grupo PET.
 */
@Entity
public class Extensionista {

    /**
     * Identificador único do extensionista.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuário associado ao extensionista.
     */
    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    /**
     * Data de ingresso do extensionista no grupo PET.
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataIngresso;

    /**
     * Indica se o extensionista recebe bolsa.
     */
    @Column(nullable = false)
    private Boolean bolsista;

    /**
     * Grupo PET ao qual o extensionista pertence.
     */
    @ManyToOne
    @JoinColumn(name = "grupo_pet_id")
    @JsonIgnore
    private GrupoPet grupoPet;

    /**
     * Retorna o identificador do extensionista.
     *
     * @return identificador do extensionista.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador do extensionista.
     *
     * @param id identificador do extensionista.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna o usuário associado.
     *
     * @return usuário associado.
     */
    public User getUser() { return user; }
    /**
     * Define o usuário associado.
     *
     * @param user usuário associado.
     */
    public void setUser(User user) { this.user = user; }
    /**
     * Retorna a data de ingresso.
     *
     * @return data de ingresso.
     */
    public Date getDataIngresso() { return dataIngresso; }
    /**
     * Define a data de ingresso.
     *
     * @param dataIngresso data de ingresso.
     */
    public void setDataIngresso(Date dataIngresso) { this.dataIngresso = dataIngresso; }
    /**
     * Indica se o extensionista é bolsista.
     *
     * @return {@code true} se for bolsista.
     */
    public Boolean getBolsista() { return bolsista; }
    /**
     * Define se o extensionista é bolsista.
     *
     * @param bolsista indicador de bolsa.
     */
    public void setBolsista(Boolean bolsista) { this.bolsista = bolsista; }
    /**
     * Retorna o grupo PET do extensionista.
     *
     * @return grupo PET.
     */
    public GrupoPet getGrupoPet() { return grupoPet; }
    /**
     * Define o grupo PET do extensionista.
     *
     * @param grupoPet grupo PET.
     */
    public void setGrupoPet(GrupoPet grupoPet) { this.grupoPet = grupoPet; }
}
