# PI
Repositório destinado ao projeto "Gerencia PET" da disicplina de Projeto Integrado I - UFES, desenvolvido pelos alunos João Vitor Soares dos Santos, Lucas D'Amato Nitz e Pedro Alexandre Simões Lorenzutti.

# Diagrama de classes
![image alt](https://github.com/PAlorenzutti/PI/blob/main/new_diagrama_uml.png?raw=true)

## Sobre o Projeto

O **Gerencia PET** é um sistema que tem como objetivo centralizar e otimizar a gestão e a divulgação das atividades promovidas pelos diversos grupos PET (Programa de Educação Tutorial) da Universidade Federal do Espírito Santo (Ufes). 

Atualmente, as informações sobre cursos e processos seletivos são descentralizadas, e o controle de membros, inscrições e certificados costuma ser um processo manual. O Gerencia PET atua resolvendo esses problemas unificando uma vitrine de cursos em formato de catálogo para os alunos/visitantes e automatizando a gestão interna (controle de frequência e emissão de certificados) para os membros organizadores (Extensionistas) e Coordenadores (Tutores) dos grupos PET.

## Guia do Projeto Gerencia PET

Bem-vindo ao guia do projeto **Gerencia PET**. Este documento detalha a arquitetura, as tecnologias utilizadas e, principalmente, como gerenciar e executar o projeto através dos *scripts* `.sh` que foram elaborados para facilitar o desenvolvimento.

## Tecnologias Utilizadas

O projeto Gerencia PET é uma aplicação *full-stack* construída sobre as seguintes tecnologias:

- **Frontend:** Angular, Typescript, RxJS, CoreUI (para interface de usuário), Bootstrap e FontAwesome.
- **Backend:** Java, Spring Boot, Maven (para gerenciamento de dependências).
- **Infraestrutura e DevOps:** Docker, Docker Compose (para subir os bancos de dados/serviços adicionais de desenvolvimento) e Bash (scripts de automatização de rotinas).

## Estrutura de Pastas

O repositório principal do projeto está organizado nos seguintes diretórios principais:

- `/gerenciapet-backend/`: Contém todo o código-fonte da API Backend desenvolvida em Java utilizando o framework Spring Boot.
- `/gerenciapet-frontend/`: Contém todo o código-fonte da aplicação Frontend desenvolvida em Angular/TypeScript.
- `/dockerfiles/`: Contém as configurações de infraestrutura conteinerizada (`docker-compose.yml`) com os bancos de dados e serviços auxiliares para o ambiente de desenvolvimento.
- `/*.sh`: Na raiz estão alocados os scripts shell para facilitar a inicialização de todo o ambiente de forma unificada.

## Arquitetura de Execução

Ao contrário de executar os servidores de backend e frontend manualmente toda vez, o Gerencia PET utiliza a combinação de **Docker Compose** (que está no diretório `dockerfiles/dev`) junto do utilitário `gnome-terminal` via scripts Bash (`.sh`) para isolar, automatizar e subir o ambiente por completo com apenas 1 comando.

Esses scripts cuidam de ler PIDs (IDs de Processos) dinâmicos armazenados na pasta temporária do Linux (`/tmp/`) para poder abrir os terminais, rodar o `ng serve` e `mvn spring-boot:run` lá dentro do contêiner e, quando solicitado, rastrear as árvores de processos filhos para matá-los (encerrá-los) sem deixar processos zumbis consumindo RAM no seu PC.

---

## Gerenciamento e Execução via Scripts `.sh`

Na raiz do projeto existem diversos utilitários shell. Abaixo está a definição exata de quando e como utilizar cada um deles.

Para rodá-los no seu terminal Linux, basta estar na raiz do projeto e digitar `./nome-do-script.sh`.

### 1. `up.sh` (Levantar o projeto pela primeira vez)
- **O que faz:** Inicia a aplicação construindo tudo do zero.
- **Como funciona:** Ele executa um `docker compose up -d` para baixar as imagens e construir os contêineres de infraestrutura limpos. Em seguida, ele abre duas abas/janelas no `gnome-terminal`.
  - Na aba do **Frontend**, ele força uma instalação limpa das dependências (`npm install`), executa um `ng build` e inicializa o servidor web (`ng serve --host 0.0.0.0`). **O servidor web estará na sua máquina local na porta 4203 (no Docker, porta 4200), devendo ser acessado via localhost:4203.**
  - Na aba do **Backend**, ele executa um `mvn clean spring-boot:run`, garantindo que os compilados Java obsoletos sejam destruídos e recriados do zero.


### 2. `start.sh` (Iniciar o projeto)
- **O que faz:** Inicia o projeto de forma **rápida** e enxuta, sem perder tempo reinstalando pacotes ou rebuildando coisas estáticas.
- **Como funciona:** Roda apenas `docker compose start` (aproveitando os contêineres já criados). Abre o terminal do Angular e dá direto um `ng serve`. Abre o terminal do backend e faz um `mvn spring-boot:run` sem o comando `clean`.

### 3. `stop.sh` (Parar o projeto)
- **O que faz:** Para a execução e encerra os processos em andamento com segurança.
- **Como funciona:** Executa `docker compose stop`, pausando os serviços. Em seguida, ele usa os arquivos com os PIDs salvos em `/tmp/` para rastrear toda a "árvore" de processos gerados pelo Angular e pelo Spring Boot e usa o comando `kill` para encerar tudo, fechando as guias abertas.

### 4. `down.sh` (Desmontar o Pprojeto)
- **O que faz:** Encerra os processos e **destrói** a rede Docker e os contêineres atrelados.
- **Como funciona:** Roda o `stop.sh` logicamente nos terminais e depois executa um `docker compose down`.

### 5. `restart.sh` (Reinício rápido)
- **O que faz:** Um atalho para `stop.sh` seguido de um `start.sh`.
- **Como funciona:** Mata os terminais ativos, pausa o docker e logo na sequência restarta os dois sem compilação de limpeza.

### 6. `rebuild.sh` (Reconstrução completa)
- **O que faz:**  Apaga e refaz **tudo**.
- **Como funciona:** Um atalho para `down.sh` seguido imediatamente pelo `up.sh`. Destrói os contêineres do Docker, mata os servidores da porta 4200 e 8080, e sobe tudo do zero realizando npm install, build do ng e maven clean.
