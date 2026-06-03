package br.ufes.gerenciapet.backend.model;

import java.io.Serial;

import org.springframework.security.core.GrantedAuthority;

public class UserRoles implements GrantedAuthority {

    @Serial
    private static final long serialVersionUID = 1L;

    private String role = "USER";

    public UserRoles(String role) {
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return this.role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
