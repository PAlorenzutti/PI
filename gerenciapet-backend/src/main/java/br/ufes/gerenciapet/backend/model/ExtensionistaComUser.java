package br.ufes.gerenciapet.backend.model;

import org.springframework.data.rest.core.config.Projection;
import java.util.Date;

@Projection(name = "comUser", types = { Extensionista.class })
public interface ExtensionistaComUser {
    Long getId();
    Date getDataIngresso();
    Boolean getBolsista();
    User getUser();
}
