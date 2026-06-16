package br.ufes.gerenciapet.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Tutor extends User {

    @Column(nullable = false, length = 50)
    private String siape;

    @Column(nullable = false, length = 100)
    private String departamento;

    @OneToOne(mappedBy = "tutorCoordenador")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private GrupoPet grupoPetCoordena;

    public Tutor() {}

    public void aprovarEvento(Evento evento) {
        // Implementação futura
    }

    public void emitirCertificados(Evento evento) {
        // Implementação futura
    }

    public String getSiape() { return siape; }
    public void setSiape(String siape) { this.siape = siape; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public GrupoPet getGrupoPetCoordena() { return grupoPetCoordena; }
    public void setGrupoPetCoordena(GrupoPet grupoPetCoordena) { this.grupoPetCoordena = grupoPetCoordena; }
}
