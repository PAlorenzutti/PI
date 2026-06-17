package br.ufes.gerenciapet.backend.model;

import java.io.Serial;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import br.ufes.gerenciapet.backend.utils.enums.TipoUsuario;

@Entity
public class User implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    public User() {}

    @SuppressWarnings("OverridableMethodCallInConstructor")
    public User(String nome, String email, String senha, LocalDate dataNascimento, Boolean isEstudanteUfes, TipoUsuario tipoUsuario) {
        this.nome = nome;
        this.email = email;
        this.setSenha(senha);
        this.dataNascimento = dataNascimento;
        this.isEstudanteUfes = isEstudanteUfes;
        this.tipoUsuario = tipoUsuario;
    }

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

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario")
    private TipoUsuario tipoUsuario;

    @Column(nullable = true, length = 20)
    private String matricula;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Inscricao> inscricoes = new ArrayList<>();

    //##############################################################################################
    // IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
    //##############################################################################################

    public void print(User user){
        System.out.println("Nome: " + user.getNome());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Data de Nascimento: " + user.getDataNascimento());
        System.out.println("Estudante UFES: " + user.getIsEstudanteUfes());
        System.out.println("Tipo Usuário: " + user.getTipoUsuario());
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

    //##############################################################################################
    // IMPLEMENTACAO METODOS DO USERDETAILS
    //##############################################################################################

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
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    //##################################################################################################################
    // GETTERS AND SETTERS
    //##################################################################################################################

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = new BCryptPasswordEncoder().encode(senha);
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Boolean getIsEstudanteUfes() {
        return isEstudanteUfes;
    }

    public void setIsEstudanteUfes(Boolean isEstudanteUfes) {
        this.isEstudanteUfes = isEstudanteUfes;
    }

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public List<Inscricao> getInscricoes() {
        return inscricoes;
    }

    public void setInscricoes(List<Inscricao> inscricoes) {
        this.inscricoes = inscricoes;
    }
}
