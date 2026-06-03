package br.ufes.gerenciapet.backend.controller;

import java.security.Principal;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.ufes.gerenciapet.backend.model.User;
import br.ufes.gerenciapet.backend.repository.UserRepository;
import br.ufes.gerenciapet.backend.repository.UserVerificationRepository;

/**
 *
 *
 *         Classe controladora das funcionalidades de usuário. Todas as
 *         requisições que envolva um usuário
 *         deverão ser implementadas aqui.
 */
@Controller
public class UserController {
    @Autowired
    UserRepository userRepo;

    // @Autowired
    // private EmailService emailService;

    @Autowired
    private UserVerificationRepository userVerificationRepo;


    @GetMapping("/api/user/logged-user")
    @ResponseBody
    public Principal user(Principal principal) {
        return principal;
    }

    @PostMapping("/api-open/user-register")
    @ResponseBody
    public String userRegister(@RequestBody User user) {
        // Antigo método usando a verificação de e-mail

        // user.setAllowed(false);
        // user.setRole("USER");

        // try {
        //     userRepo.save(user);

        //     // Cria token de verificação
        //     String token = UUID.randomUUID().toString();
        //     UserVerification userVerification = new UserVerification(token, user);
        //     userVerificationRepo.save(userVerification);

        //     // Link de verificação para o client no front-end;
        //     String verifyLink = baseUrl + "/verify?token=" + token;

        //     // Envia o link de verificação para o e-mail do usuário
        //     String assunto = "Cadastro no Amamenta";
        //     String msg = "Olá, " + user.getFullName() + "\n\n"
        //             + "Seu cadastro foi realizado com sucesso no Amamenta. "
        //             + "Para ativar sua conta, clique no link abaixo:\n"
        //             + verifyLink + "\n\n"
        //             + "Use este link para verificar seu e-mail e ativar sua conta.";

        //     // Agora é chamado o servico de email e o mesmo é enviado
        //     String emailSend = this.emailService.send(user.getEmail(), assunto, msg);
        //     if ("not-sent".equals(emailSend)) {
        //         return "{\"status\": \"email-service-error\"}";
        //     }

        // } catch (DataIntegrityViolationException e) {
        //     return "{\"status\": \"not-allowed\"}";
        // } catch (NullPointerException e) {
        //     return "{\"status\": \"lack-of-user-terms\"}";
        // } catch (Exception e) {
        //     return "{\"status\": \"db-problem\"}";
        // }

        // return "{\"status\": \"registered\"}";

        // Por enquanto, sem verificação de e-mail, todo usuário que for criado, terá permissão de acesso ao sistema.
        // user.setAllowed(false);
        user.setAllowed(true);

        user.setRole("USER");
        try {
            userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            return "{\"status\": \"not-allowed\"}";
        } catch (Exception e) {
            return "{\"status\": \"db-problem\"}";
        }
        return "{\"status\": \"registered\"}";
    }

    @PostMapping("/api-open/new-user-register")
    @ResponseBody
    public String newUserRegister(@RequestBody User user) {
        // try {
        //     // Gera senha aleatória e seta ela no usuário
        //     String generatedPassword = passwordGenerate();
        //     user.setPasswd(generatedPassword);

        //     if("USER".equals(user.getRole())) {
        //         user.setAllowed(false);
        //     }

        //     // Salva o usuário no banco
        //     userRepo.save(user);

        //     // Envia e-mail com as credenciais
        //     String assunto = "Cadastro no Amamenta - Credenciais de Acesso";
        //     String msg = "Olá, " + user.getFullName() + "\n\n"
        //             + "Seu cadastro foi realizado com sucesso no Amamenta.\n"
        //             + "Suas credenciais de acesso são:\n\n"
        //             + "CPF: " + user.getCpf() + "\n"
        //             + "Senha: " + generatedPassword + "\n\n"
        //             + "Por segurança, recomendamos que você altere sua senha após o primeiro login.";

        //     String emailSend = this.emailService.send(user.getEmail(), assunto, msg);
        //     if ("not-sent".equals(emailSend)) {
        //         return "{\"status\": \"email-service-error\"}";
        //     }

        //     return "{\"status\": \"registered\"}";

        // } catch (DataIntegrityViolationException e) {
        //     return "{\"status\": \"not-allowed\"}";
        // } catch (Exception e) {
        //     return "{\"status\": \"db-problem\"}";
        // }

        try {
            user.setPasswd("GerenciaPET123");

            if ("USER".equals(user.getRole())) {
                user.setAllowed(true);
            }

            userRepo.save(user);

            return "{\"status\": \"registered\"}";

        } catch (DataIntegrityViolationException e) {
            return "{\"status\": \"not-allowed\"}";
        } catch (Exception e) {
            return "{\"status\": \"db-problem\"}";
        }
    }

    // private String passwordGenerate() {
    //     Random rand = new Random();
    //     char[] carcteres = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm".toCharArray();

    //     StringBuilder sb = new StringBuilder();
    //     for (int i = 0; i < 8; i++) {
    //         int pos = rand.nextInt(carcteres.length);
    //         sb.append(carcteres[pos]);
    //     }
    //     return sb.toString();
    // }

    @GetMapping("/api-open/user-verify")
    @ResponseBody
    public String verifyUser(@RequestParam("token") String token) {
        try {
            return userVerificationRepo.findByToken(token)
                    .map(userVerification -> {
                        // Token já utilizado (cleanup defensivo)
                        if (userVerification.isUsed()) {
                            // Remove o registro legado de token já utilizado
                            userVerificationRepo.delete(userVerification);
                            return "{\"status\": \"already-used\"}";
                        }

                        // Verificação bem-sucedida: ativa o usuário e apaga o token
                        User user = userVerification.getUser();
                        user.setAllowed(true);
                        userRepo.save(user);

                        // Remove o token utilizado
                        userVerificationRepo.delete(userVerification);

                        return "{\"status\": \"verified\"}";
                    })
                    .orElse("{\"status\": \"invalid-token\"}");
        } catch (Exception e) {
            return "{\"status\": \"db-problem\"}";
        }
    }

    @PostMapping("/api/user/compare-passwords")
    @ResponseBody
    public String comparePasswords(@RequestBody Map<String, String> usuJson) {

        String cpf = usuJson.get("cpf");
        String password = usuJson.get("password");

        try {
            User usuario = userRepo.findByCpf(cpf);

            if (usuario == null) {
                return "{\"state\": \"inexistent-user\"}";
            } else {
                System.err.println(usuario.getCpf());
                BCryptPasswordEncoder cripto = new BCryptPasswordEncoder();
                if (cripto.matches(password, usuario.getPasswd())) {
                    return "{\"state\": \"correct-password\"}";
                } else {
                    return "{\"state\": \"incorrect-password\"}";
                }
            }
        } catch (Exception e) {
            return "{\"state\": \"db-problem\"}";
        }
    }

    @GetMapping("api/user/changeAllowedAccessToAll")
    @ResponseBody
    public String changeAllowedAcess(@RequestParam("role") String role, @RequestParam("access") Boolean access) {
        List<User> users = userRepo.findByRole(role);

        for (User user : users) {
            user.setAllowed(access);
        }
        userRepo.saveAll(users);

        return "{\"state\": \"success\"}";
    }

    @DeleteMapping("/api/user/delete/{id}")
    @Transactional
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Optional<User> userOptional = userRepo.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // só tenta apagar o usuário se ainda existir
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/user/change-access/{userId}")
    @ResponseBody
    public ResponseEntity<String> changeUserAccess(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body) {

        try {
            Boolean allowed = body.get("allowed");

            if (allowed == null) {
                return ResponseEntity.badRequest()
                        .body("{\"status\": \"invalid-request\"}");
            }

            Optional<User> userOptional = userRepo.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"status\": \"user-not-found\"}");
            }

            User user = userOptional.get();
            user.setAllowed(allowed);
            userRepo.save(user);

            // // Se o acesso foi liberado, remove o token de verificação pendente (se existir)
            // if (allowed) {
            //     userVerificationRepo.findByUserAndUsed(user, false)
            //             .ifPresent(verification -> {
            //                 userVerificationRepo.delete(verification);
            //             });
            // }

            return ResponseEntity.ok("{\"status\": \"success\"}");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\": \"error\"}");
        }
    }

    @GetMapping("api/user/count-users")
    @ResponseBody
    public long getMethodName() {
        return userRepo.count();
    }
}
