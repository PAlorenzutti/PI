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
import javax.persistence.OneToOne;

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

/**
 * Entidade que representa um usuário do sistema Gerencia PET.
 *
 * <p>A classe tambem implementa {@link UserDetails} para integrar os dados do
 * usuário ao mecanismo de autenticação do Spring Security.</p>
 */
@Entity
public class User implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Construtor padrão exigido pelo JPA.
     */
    public User() {}

    /**
     * Cria um usuário com os dados básicos de cadastro.
     *
     * @param nome nome completo do usuário.
     * @param email email usado como identificador de login.
     * @param senha senha em texto puro, que será criptografada antes de ser salva.
     * @param dataNascimento data de nascimento do usuário.
     * @param isEstudanteUfes indica se o usuário é estudante da UFES.
     * @param tipoUsuario papel do usuário no sistema.
     */
    @SuppressWarnings("OverridableMethodCallInConstructor")
    public User(String nome, String email, String senha, LocalDate dataNascimento, Boolean isEstudanteUfes, TipoUsuario tipoUsuario) {
        this.nome = nome;
        this.email = email;
        this.setSenha(senha);
        this.dataNascimento = dataNascimento;
        this.isEstudanteUfes = isEstudanteUfes;
        this.tipoUsuario = tipoUsuario;
    }

    /**
     * Identificador único do usuário.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome completo do usuário.
     */
    @Column(length = 150, nullable = false)
    private String nome;

    /**
     * Email único usado para login.
     */
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    /**
     * Senha criptografada do usuário.
     */
    @Column(nullable = false)
    private String senha;

    /**
     * Data de nascimento do usuário.
     */
    @Column(nullable = false)
    private LocalDate dataNascimento;

    /**
     * Indica se o usuário possui vínculo estudantil com a UFES.
     */
    @Column(nullable = false)
    private Boolean isEstudanteUfes;

    /**
     * Papel do usuário dentro do sistema.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario")
    private TipoUsuario tipoUsuario;

    /**
     * Matrícula acadêmica do usuário, quando aplicável.
     */
    @Column(nullable = true, length = 20)
    private String matricula;

    /**
     * Inscrições realizadas pelo usuário em eventos.
     */
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Inscricao> inscricoes = new ArrayList<>();

    //##############################################################################################
    // IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
    //##############################################################################################

    /**
     * Imprime no console dados resumidos de um usuário.
     *
     * @param user usuário cujos dados serão exibidos.
     */
    public void print(User user){
        System.out.println("Nome: " + user.getNome());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Data de Nascimento: " + user.getDataNascimento());
        System.out.println("Estudante UFES: " + user.getIsEstudanteUfes());
        System.out.println("Tipo Usuário: " + user.getTipoUsuario());
    }

    /**
     * Verifica se as credenciais informadas correspondem ao usuário atual.
     *
     * @param email email informado no login.
     * @param senha senha em texto puro informada no login.
     * @return {@code true} quando o email coincide e a senha confere.
     */
    public boolean login(String email, String senha) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return this.email.equals(email) && encoder.matches(senha, this.senha);
    }

    /**
     * Atualiza os dados cadastrais editáveis do usuário.
     *
     * @param novosDados objeto com os novos valores de cadastro.
     */
    public void atualizarDados(User novosDados) {
        this.nome = novosDados.getNome();
        this.dataNascimento = novosDados.getDataNascimento();
        this.isEstudanteUfes = novosDados.getIsEstudanteUfes();
    }

    //##############################################################################################
    // IMPLEMENTACAO METODOS DO USERDETAILS
    //##############################################################################################

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.getClass().getSimpleName().toUpperCase()));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getPassword() {
        return this.senha;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getUsername() {
        return this.email;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    //##################################################################################################################
    // GETTERS AND SETTERS
    //##################################################################################################################

    /**
     * Retorna o identificador único do usuário.
     *
     * @return identificador do usuário.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o identificador único do usuário.
     *
     * @param id identificador do usuário.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Retorna o nome completo do usuário.
     *
     * @return nome completo.
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome completo do usuário.
     *
     * @param nome nome completo.
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * Retorna o email do usuário.
     *
     * @return email de login.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Define o email do usuário.
     *
     * @param email email de login.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Retorna a senha criptografada do usuário.
     *
     * @return senha criptografada.
     */
    public String getSenha() {
        return senha;
    }

    /**
     * Criptografa e define a senha do usuário.
     *
     * @param senha senha em texto puro.
     */
    public void setSenha(String senha) {
        this.senha = new BCryptPasswordEncoder().encode(senha);
    }

    /**
     * Retorna a data de nascimento do usuário.
     *
     * @return data de nascimento.
     */
    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    /**
     * Define a data de nascimento do usuário.
     *
     * @param dataNascimento data de nascimento.
     */
    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    /**
     * Indica se o usuário é estudante da UFES.
     *
     * @return {@code true} se o usuário for estudante da UFES.
     */
    public Boolean getIsEstudanteUfes() {
        return isEstudanteUfes;
    }

    /**
     * Define se o usuário é estudante da UFES.
     *
     * @param isEstudanteUfes indicador de vínculo estudantil com a UFES.
     */
    public void setIsEstudanteUfes(Boolean isEstudanteUfes) {
        this.isEstudanteUfes = isEstudanteUfes;
    }

    /**
     * Retorna o papel do usuário no sistema.
     *
     * @return tipo do usuário.
     */
    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    /**
     * Define o papel do usuário no sistema.
     *
     * @param tipoUsuario tipo do usuário.
     */
    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }
    /**
     * Retorna a matrícula acadêmica do usuário.
     *
     * @return matrícula acadêmica, quando existente.
     */
    public String getMatricula() {
        return matricula;
    }

    /**
     * Define a matrícula acadêmica do usuário.
     *
     * @param matricula matrícula acadêmica.
     */
    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    /**
     * Retorna as inscrições realizadas pelo usuário.
     *
     * @return lista de inscrições.
     */
    public List<Inscricao> getInscricoes() {
        return inscricoes;
    }

    /**
     * Define as inscrições realizadas pelo usuário.
     *
     * @param inscricoes lista de inscrições.
     */
    public void setInscricoes(List<Inscricao> inscricoes) {
        this.inscricoes = inscricoes;
    }
}
