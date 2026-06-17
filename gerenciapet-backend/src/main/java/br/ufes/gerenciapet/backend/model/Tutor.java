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

@Entity
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String siape;

    @Column(nullable = false, length = 100)
    private String departamento;

    @OneToOne(mappedBy = "tutorCoordenador", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private GrupoPet grupoPetCoordena;

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSiape() { return siape; }
    public void setSiape(String siape) { this.siape = siape; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public GrupoPet getGrupoPetCoordena() { return grupoPetCoordena; }
    public void setGrupoPetCoordena(GrupoPet grupoPetCoordena) { this.grupoPetCoordena = grupoPetCoordena; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
