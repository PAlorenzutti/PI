package br.ufes.gerenciapet.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.repository.UserRepository;

/**
 * Serviço de busca de usuários usado pelo Spring Security durante a autenticação.
 */
@Service
public class ServiceDetUser implements UserDetailsService {

    @Autowired
    private UserRepository ur;

    /**
     * Carrega um usuário pelo email informado no formulário de login.
     *
     * @param email email usado como nome de usuário.
     * @return detalhes do usuário autenticável.
     * @throws UsernameNotFoundException quando o email não estiver cadastrado.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = ur.findByEmail(email);

        if (user == null) {
            setAuthenticationFailureReason("user-not-found");
            throw new UsernameNotFoundException("user-not-found");
        }

        return user;
    }

    /**
     * Armazena na requisição o motivo de falha na autenticação.
     *
     * @param reason código textual do motivo de falha.
     */
    @SuppressWarnings("UseSpecificCatch")
    private void setAuthenticationFailureReason(String reason) {
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            attr.getRequest().setAttribute("authenticationFailureReason", reason);
        } catch (Exception e) {
            System.out.println("Could not set authentication failure reason: " + e.getMessage());
        }
    }

}
