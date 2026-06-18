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
 * Configuração de segurança da aplicação.
 *
 * <p>Define regras de autenticação, CORS, handlers de login e codificação de
 * senhas.</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityWebConfig {

    /**
     * Cria a cadeia de filtros de segurança HTTP.
     *
     * @param http objeto de configuração de segurança do Spring.
     * @return cadeia de filtros configurada.
     * @throws Exception quando a cadeia não puder ser montada.
     */
    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(withDefaults());

        http.authorizeRequests(requests -> requests.antMatchers("/dashboard/**").authenticated());

        http.authorizeRequests(requests -> requests.anyRequest().permitAll()).csrf(csrf -> csrf.disable());

        http.formLogin(login -> login.loginPage("/login")
                .passwordParameter("password").usernameParameter("email")
                .successHandler(successHandler()).failureHandler(failureHandler()));

        return http.build();
    }

    /**
     * Define as regras de CORS aceitas pelo backend.
     *
     * @return fonte de configuração CORS aplicada a todas as rotas.
     */
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

    /**
     * Cria o handler executado após login bem-sucedido.
     *
     * @return handler que escreve a resposta JSON de autenticação.
     */
    private AuthenticationSuccessHandler successHandler() {
        return (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                Authentication authentication) -> {
            httpServletResponse.getWriter().append("{\"status\": \"user-authenticated\"}");
            httpServletResponse.setStatus(200);
        };
    }

    /**
     * Cria o handler executado quando o login falha.
     *
     * @return handler que escreve o motivo de falha em formato JSON.
     */
    private AuthenticationFailureHandler failureHandler() {
        return (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                AuthenticationException e) -> {
                    
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
                        default -> {
                        }
                    }
            }

            httpServletResponse.getWriter().append("{\"status\": \"authentication-fail\"}");
            httpServletResponse.setStatus(200);
        };
    }

    /**
     * Expõe o gerenciador de autenticação configurado pelo Spring.
     *
     * @param auth configuração de autenticação do Spring Security.
     * @return gerenciador de autenticação da aplicação.
     * @throws Exception quando o gerenciador não puder ser obtido.
     */
    @Bean
    protected AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception {
        return auth.getAuthenticationManager();
    }

    /**
     * Cria o codificador usado para armazenar e comparar senhas.
     *
     * @return codificador BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
