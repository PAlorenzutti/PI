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

@Service
public class ServiceDetUser implements UserDetailsService {

    @Autowired
    private UserRepository ur;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = ur.findByEmail(email);

        if (user == null) {
            setAuthenticationFailureReason("user-not-found");
            throw new UsernameNotFoundException("user-not-found");
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
