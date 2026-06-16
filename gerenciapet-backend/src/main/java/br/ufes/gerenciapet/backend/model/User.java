package br.ufes.gerenciapet.backend.model;

import java.io.Serial;
import java.util.Collection;
import java.util.Collections;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "tipoUsuario",
    defaultImpl = AlunoTutorado.class
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = AlunoTutorado.class, name = "AlunoTutorado"),
    @JsonSubTypes.Type(value = MembroPet.class, name = "MembroPet"),
    @JsonSubTypes.Type(value = TutorCoordenador.class, name = "TutorCoordenador")
})
public abstract class User implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false)
    private String nome;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false)
    private Boolean isEstudanteUfes;

    public User() {}

    @SuppressWarnings("OverridableMethodCallInConstructor")
    public User(String nome, String email, String senha, LocalDate dataNascimento, Boolean isEstudanteUfes) {
        this.nome = nome;
        this.email = email;
        this.setSenha(senha);
        this.dataNascimento = dataNascimento;
        this.isEstudanteUfes = isEstudanteUfes;
    }

    public boolean login(String email, String senha) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return this.email.equals(email) && encoder.matches(senha, this.senha);
    }

    public void atualizarDados(User novosDados) {
        this.nome = novosDados.getNome();
        this.dataNascimento = novosDados.getDataNascimento();
        this.isEstudanteUfes = novosDados.getIsEstudanteUfes();
    }

    // USER DETAILS IMPLEMENTATION
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.getClass().getSimpleName().toUpperCase()));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email; // Authentication will be based on email
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    // GETTERS AND SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) {
        this.senha = new BCryptPasswordEncoder().encode(senha);
    }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    public Boolean getIsEstudanteUfes() { return isEstudanteUfes; }
    public void setIsEstudanteUfes(Boolean isEstudanteUfes) { this.isEstudanteUfes = isEstudanteUfes; }
}
