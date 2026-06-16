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

@Configuration
@EnableWebSecurity
public class SecurityWebConfig {

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

    private AuthenticationSuccessHandler successHandler() {
        return (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                Authentication authentication) -> {
            httpServletResponse.getWriter().append("{\"status\": \"user-authenticated\"}");
            httpServletResponse.setStatus(200);
        };
    }

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

    @Bean
    protected AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception {
        return auth.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
