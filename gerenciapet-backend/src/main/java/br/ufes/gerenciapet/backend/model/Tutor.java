package br.ufes.gerenciapet.backend.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entidade que representa um tutor de grupo PET.
 */
@Entity
public class Tutor {

    /**
     * Identificador único do tutor.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Numero SIAPE do tutor.
     */
    @Column(nullable = false, length = 50)
    private String siape;

    /**
     * Departamento academico do tutor.
     */
    @Column(nullable = false, length = 100)
    private String departamento;

    /**
     * Grupo PET coordenado pelo tutor.
     */
    @OneToOne(mappedBy = "tutorCoordenador", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private GrupoPet grupoPetCoordena;

    /**
     * Usuário associado ao tutor.
     */
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    /**
     * Retorna o identificador do tutor.
     *
     * @return identificador do tutor.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador do tutor.
     *
     * @param id identificador do tutor.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna o SIAPE do tutor.
     *
     * @return SIAPE do tutor.
     */
    public String getSiape() { return siape; }
    /**
     * Define o SIAPE do tutor.
     *
     * @param siape SIAPE do tutor.
     */
    public void setSiape(String siape) { this.siape = siape; }
    /**
     * Retorna o departamento do tutor.
     *
     * @return departamento do tutor.
     */
    public String getDepartamento() { return departamento; }
    /**
     * Define o departamento do tutor.
     *
     * @param departamento departamento do tutor.
     */
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    /**
     * Retorna o grupo PET coordenado.
     *
     * @return grupo PET coordenado.
     */
    public GrupoPet getGrupoPetCoordena() { return grupoPetCoordena; }
    /**
     * Define o grupo PET coordenado.
     *
     * @param grupoPetCoordena grupo PET coordenado.
     */
    public void setGrupoPetCoordena(GrupoPet grupoPetCoordena) { this.grupoPetCoordena = grupoPetCoordena; }
    /**
     * Retorna o usuário associado ao tutor.
     *
     * @return usuário associado.
     */
    public User getUser() { return user; }
    /**
     * Define o usuário associado ao tutor.
     *
     * @param user usuário associado.
     */
    public void setUser(User user) { this.user = user; }
}
