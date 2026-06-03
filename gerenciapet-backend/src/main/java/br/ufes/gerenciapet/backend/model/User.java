package br.ufes.gerenciapet.backend.model;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
public class User implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    @SuppressWarnings("OverridableMethodCallInConstructor")
    public User(String fullName, String email, String cpf, String passwd, boolean allowed, String role) {
        this.fullName = fullName;
        this.email = email;
        this.cpf = cpf;
        this.setPasswd(passwd); // O nome precisa ser diferente para nao ter o mesmo nome do password do UserDetails
        this.allowed = allowed;
        this.role = role;
    }

    public User () {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=150, nullable = false)
    private String fullName;

    @Column(length=50, nullable = true, unique=true)
    private String email;

    @Column(nullable = false, unique = true, length = 15)
    private String cpf;

    @Column(nullable = false)
    private String passwd;

    @Column(nullable = false)
    private boolean allowed;

    @Column(nullable = false)
    private String role; // SUPER, ADMIN, USER, CITY, EXTERN

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(nullable = true)),
        @AttributeOverride(name = "houseNumber", column = @Column(nullable = true)),
        @AttributeOverride(name = "cep", column = @Column(nullable = true)),
        @AttributeOverride(name = "neighborhood", column = @Column(nullable = true)),
        @AttributeOverride(name = "city", column = @Column(nullable = true)),
        @AttributeOverride(name = "state", column = @Column(nullable = true)),
        @AttributeOverride(name = "addInfo", column = @Column(nullable = true)),
        @AttributeOverride(name = "refPoint", column = @Column(nullable = true)),
    })
    private Address address;

    @Column(nullable = true, length = 15)
    private String cellPhoneNumber;

    @Column(nullable = true, length = 15)
    private String phoneNumber;

    //##############################################################################################
    // IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
    //##############################################################################################

    public void print(User user){
        System.out.println("Nome: " + user.getFullName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("CPF: " + user.getCpf());
        System.out.println("Senha: " + user.getPassword());
        System.out.println("Apto: " + user.isAllowed());
        System.out.println("Papel: " + user.getRole());
    }

    //##############################################################################################
    // IMPLEMENTACAO METODOS DO USERDETAILS
    //##############################################################################################

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<UserRoles> roles = new ArrayList<>();
        roles.add(new UserRoles(this.role));
        return roles;
    }

    @Override
    public String getPassword() {
        return this.passwd;
    }

    @Override
    public String getUsername() {
        return this.cpf;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = new BCryptPasswordEncoder().encode(passwd);
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getCellPhoneNumber() {
        return cellPhoneNumber;
    }

    public void setCellPhoneNumber(String cellPhoneNumber) {
        this.cellPhoneNumber = cellPhoneNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}


