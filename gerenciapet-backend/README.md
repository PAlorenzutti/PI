# Amamenta Backend

O backend do projeto é desenvolvido utilizando Spring Boot com Java e o banco de dados MySQL. O tutorial para criar o ambiente de desenvolvimento usando docker [está descrito neste arquivo](https://github.com/pad-ufes/dockerfiles/tree/main/dev). As versões utilizadas são descritas a seguir:

- OpenJDK 18
- Maven 3.6.3
- MySQL 8.0.30

Dentro da imagem Docker, também utilizamos o PHPMyAdmin para auxiliar no gerenciamento do banco de dados.


**Importante**: Para melhor entender a integração entre o servidor e o frontend, dirija-se ao [repositório de documentação](https://github.com/pad-ufes/docs).


# Executando o projeto

Para executar o projeto pela primeira vez, você deve seguir os seguintes passos:

1. Se você não estiver usando a imagem Docker, é necessário conferir se o arquivo `application.properties` no diretório `server/src/main/resources/` está correto com as configurações que você usou na configuração. Se você está usando a imagem Docker, o arquivo versionado já deve funcionar sem maiores problemas.

Esse arquivo contém as configurações gerais do servidor. Caso tenha o banco criado com outro nome de usuário e senha ou deseja criar com valores diferentes, não tem problema. Basta alterar os campos `spring.datasource.username` e `spring.datasource.password` no `application.properties`. 

**Importante 1:** se você não está usando Docker e, portanto, tiver alterado as informações deste arquivo, não versione as suas modificações. Se você fizer isso, você vai alterar as configurações de todos os seus colegas de time. Por isso, o Docker é sempre o mais recomendável.


2. Abra um terminal na pasta raiz do servidor e execute o comando: `mvn spring-boot:run`. Se tudo ocorreu com sucesso, o Spring Boot (via Tomcat) subirá um servidor no `localhost:8080`. Basta acessar o endereço no browser.

# Instruções para consultas no banco de dados
As consultas no banco de dados são realizadas utilizando o Spring Data JPA. Todas as classes que realizam essa comunicação estão no pacote `repositorio`. Esse mesmo pacote é responsável pela API (descrita abaixo).
Para obter mais informações do seu funcionamento basta acessar [a documentação do Spring Data](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/).

# Instruções para usar a API
Toda a API foi construída utilizando o Spring Data Rest sob a rota `/api/[funcao]`. Para entender melhor o funcionamento do framework, você deve acessar os seguintes links:
* [Iniciando com Spring Data Rest](https://spring.io/guides/gs/accessing-data-rest/)
* [Documentação do Spring Data Rest](https://docs.spring.io/spring-data/rest/docs/current/reference/html/)

## Mais informações
 spring-boot, joinfaces e primefaces.
* [Spring-boot](https://spring.io/projects/spring-boot)
* [Java](https://www.java.com/en/download/help/download_options.xml)
* [Maven](https://maven.apache.org/)
* [MySQL](https://www.mysql.com/downloads/)

