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
import br.ufes.gerenciapet.backend.repository.UserVerificationRepository;

/**
 *
 * @author André Pacheco
 *
 *         Essa classe implementa a inteface que permite o spring boot buscar no
 *         banco de dados um usuario,
 *         verificar se sua senha é valida e verificar também se ele está apto a
 *         usar o sistema. Caso alguma dessas
 *         verificações falhe, o login também falhará e o usuário não será
 *         autenticado.
 *
 *         Apesar de ser um serviço, é interessante que essa classe esteja aqui
 *         pois é algo que é intrinsicamente
 *         relacionada a segurança e quase nunca será alterada
 *
 */

@Service
public class ServiceDetUser implements UserDetailsService {

    @Autowired
    private UserRepository ur;

    @Autowired
    private UserVerificationRepository userVerificationRepo;

    @Override
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {
        User user = ur.findByCpf(cpf);

        if (user == null) {
            setAuthenticationFailureReason("user-not-found");
            throw new UsernameNotFoundException("user-not-found");
        }

        // Verifica se existe token de verificação pendente (usuário não verificou o
        // e-mail)
        var pendingVerification = userVerificationRepo.findByUserAndUsed(user, false);

        if (!user.isAllowed() && pendingVerification.isPresent()) {
            setAuthenticationFailureReason("user-not-verified");
            throw new UsernameNotFoundException("user-not-verified");
        }

        if (!user.isAllowed()) {
            setAuthenticationFailureReason("user-not-allowed");
            throw new UsernameNotFoundException("user-not-allowed");
        }

        return user;
    }

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
