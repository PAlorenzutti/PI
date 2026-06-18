package br.ufes.gerenciapet.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Ponto de entrada da aplicação Gerencia PET.
 *
 * <p>Inicializa o contexto Spring Boot e habilita tarefas agendadas usadas pelo
 * backend.</p>
 */
@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	/**
	 * Inicializa a aplicação Spring Boot.
	 *
	 * @param args argumentos recebidos pela linha de comando.
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
