package br.ufes.gerenciapet.backend.security;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * @author André Pacheco
 *
 *         Essa classe configura o spring boot para realizar a autenticação de
 *         usuário do sistema
 *         Caso o usuário exista, esteja apto e a senha esteja correta, a
 *         requisição para /login retorna
 *         200 com um JSON 'usuario-autenticado'. Caso contrário, retorna 401 e
 *         'falha-autenticacao'.
 *
 */

@Configuration
@EnableWebSecurity
public class SecurityWebConfig {

    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(withDefaults());

        http.authorizeRequests(requests -> requests.antMatchers("/dashboard/**").authenticated());

        http.authorizeRequests(requests -> requests.anyRequest().permitAll()).csrf(csrf -> csrf.disable());

        http.formLogin(login -> login.loginPage("/login")
                .passwordParameter("password").usernameParameter("cpf")
                .successHandler(successHandler()).failureHandler(failureHandler()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:4203"));
        configuration.setAllowCredentials(true);

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Retorna 200 e 'user-authenticated' sucesso para aqueles usuarios que
    // conseguirem logar
    private AuthenticationSuccessHandler successHandler() {
        return (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                Authentication authentication) -> {
            httpServletResponse.getWriter().append("{\"status\": \"user-authenticated\"}");
            httpServletResponse.setStatus(200);
        };
    }

    /// Retorna 401 e 'authentication-fail' para aqueles usuarios que não
    /// conseguirem
    // logar
    private AuthenticationFailureHandler failureHandler() {
        return (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                AuthenticationException e) -> {

            // Verifica se temos um motivo específico da falha armazenado no request
            Object failureReason = httpServletRequest.getAttribute("authenticationFailureReason");

            if (failureReason != null) {
                String reason = failureReason.toString();
                if (null != reason)
                    switch (reason) {
                        case "user-not-found" -> {
                            httpServletResponse.getWriter().append("{\"status\": \"user-not-found\"}");
                            httpServletResponse.setStatus(200);
                            return;
                        }
                        case "user-not-verified" -> {
                            httpServletResponse.getWriter().append("{\"status\": \"user-not-verified\"}");
                            httpServletResponse.setStatus(200);
                            return;
                        }
                        case "user-not-allowed" -> {
                            httpServletResponse.getWriter().append("{\"status\": \"user-not-allowed\"}");
                            httpServletResponse.setStatus(200);
                            return;
                        }
                        default -> {
                        }
                    }
            }

            httpServletResponse.getWriter().append("{\"status\": \"authentication-fail\"}");
            httpServletResponse.setStatus(200);
        };
    }

    @Bean
    protected AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception {
        // Descomente as duas linha abaixo para usar o modo de autenticação em memória,
        // ou seja, sem banco de dados
        /*
         * auth.inMemoryAuthentication()
         * .withUser("Andre").password("123").roles("ADMIN");
         */
        return auth.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
