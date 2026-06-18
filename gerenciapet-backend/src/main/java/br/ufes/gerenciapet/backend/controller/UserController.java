package br.ufes.gerenciapet.backend.controller;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.repository.UserRepository;

/**
 * Controlador responsável pelas operações de usuário expostas pela API.
 */
@Controller
public class UserController {
    @Autowired
    UserRepository userRepo;

    /**
     * Retorna o usuário autenticado na sessão atual.
     *
     * @param principal representação do usuário autenticado pelo Spring Security.
     * @return principal recebido na requisição.
     */
    @GetMapping("/api/user/logged-user")
    @ResponseBody
    public Principal user(Principal principal) {
        return principal;
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * @param user dados do usuário enviados no corpo da requisição.
     * @return JSON textual com o estado do cadastro.
     */
    @PostMapping("/api-open/user-register")
    @ResponseBody
    public String userRegister(@RequestBody User user) {
        try {
            userRepo.save(user);
            return "{\"status\": \"registered\"}";
        } catch (DataIntegrityViolationException e) {
            return "{\"status\": \"not-allowed\"}";
        } catch (Exception e) {
            return "{\"status\": \"db-problem\"}";
        }
    }

    /**
     * Compara a senha informada com a senha criptografada armazenada para o
     * usuário.
     *
     * @param usuJson mapa contendo email e password.
     * @return JSON textual com o resultado da comparacao.
     */
    @PostMapping("/api/user/compare-passwords")
    @ResponseBody
    public String comparePasswords(@RequestBody Map<String, String> usuJson) {

        String email = usuJson.get("email");
        String password = usuJson.get("password");

        try {
            User user = userRepo.findByEmail(email);

            if (user == null) {
                return "{\"state\": \"inexistent-user\"}";
            } else {
                BCryptPasswordEncoder cripto = new BCryptPasswordEncoder();
                if (cripto.matches(password, user.getSenha())) {
                    return "{\"state\": \"correct-password\"}";
                } else {
                    return "{\"state\": \"incorrect-password\"}";
                }
            }
        } catch (Exception e) {
            return "{\"state\": \"db-problem\"}";
        }
    }

    /**
     * Remove um usuário pelo identificador.
     *
     * @param id identificador do usuário que será removido.
     * @return resposta HTTP 204 quando removido ou 404 quando inexistente.
     */
    @DeleteMapping("/api/user/delete/{id}")
    @Transactional
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Optional<User> userOptional = userRepo.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
        }

        return ResponseEntity.noContent().build();
    }

    /**
     * Conta a quantidade total de usuários cadastrados.
     *
     * @return número de usuários persistidos.
     */
    @GetMapping("api/user/count-users")
    @ResponseBody
    public long countUsers() {
        return userRepo.count();
    }
}
