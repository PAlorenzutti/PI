# Repositório de Dockerfiles de desenvolvimento

Este tutorial ensina como configurar seu ambiente de desenvolvimento do Amamenta utilizando Docker. 

**Passo 1:** [baixe uma cópia do banco de dados SQL]() (por hora essa pasta ainda não existe). Se você não tem acesso aos dados, solicite no Discord.

**Passo 2:** dentro desta pasta, crie um arquivo chamado `.env` com caminho da pasta onde você baixou os dados. Exemplo:

```
DATABASE_PATH=/home/patcha/dados_baixados
```

**Passo 3:** execute o seguinte comando:

```
docker-compose up -d
```

Esse comando vai buildar as imagens e criar todo ambiente de desenvolvimento. Isso pode levar algum tempo uma vez que será efetuado o download de uma série de imagens e todas as depedências do sistema.

**Importante**: o build da imagem do `amamenta-backfront` pode levar algum tempo (+15min)


Quando tudo finalizar, se tudo deu certo, você deve ter 5 containers rodando na sua máquina. Ao executar o comando `docker ps` você deve encontrar os seguintes containers:

```
IMAGE             PORTS                                                                                      NAMES
phpmyadmin        0.0.0.0:8888->80/tcp, :::8888->80/tcp                                                  amamenta-phpmyadmin
mysql             0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp                                   amamenta-mysql
java_node         0.0.0.0:4200->4200/tcp, :::4200->4200/tcp, 0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   amamenta-backfront
```

Se esses containers não estiverem ativos, algum problema ocorreu durante a construção das imagens. Tente fazer novamente. Se não conseguir, procure ajuda.

Breve descrição de cada container:
- `amamenta-mysql`: container com a imagem do banco MySQL. O banco vai ser criado a partir dos dados que você baixou no passo 1.
- `amamenta-phpmyadmin`: container com a imagem do PHPMyAdmin. Ele já se conecta com o banco de dados automaticamente.
- `amamenta-backfront`: este é o container de desenvolvimento do Amamenta. Veja a próxima seção para mais instruções de como usar.

## Utilizando o PHPMyAdmin

O PHPMyAdmin pode ser acessado na sua máquina utilizando o endereço `localhost:8888`. O login padrão é `root` e a senha padrão também é `root`. Observe que se você alterou as credenciais do banco, você também deve alterar aqui.

Nele você vai encontrar o banco de dados de nome Amamenta. Você pode realizar consultas, remoção, adicionar dados, etc. Para um tutorial de como usar o PHPMyAdmin [assista este vídeo](https://www.youtube.com/watch?v=kviT7G14gqk).


## Utilizando o container de desenvolvimento

O container `amamenta-backfront` contém tudo que é necessário para executar o front e o backend. A ideia é que você acesse-o com o comando:

```
docker exec -ti amamenta-backfront /bin/bash
```

Feito isso, você ganha acesso a um terminal que está rodando dentro do container. O diretório de trabalho principal é `/app` e ele é mapeado através de um volume com os diretórios da sua máquina. Com isso, você pode:

- Servir apenas o frontend:
  - Primeiro, vamos instalar as dependências do projeto. Entre no diretório `/app/frontend/` e execute o comando `npm install`
    - Como você já deve saber, esse comando vai instalar as dependências do Angular. Tudo vai ser baixado dentro da pasta `node_modules`. Como a pasta está mapeada no volume do docker-compose, você precisa fazer isso uma única vez (será refeito apenas se você atualizar alguma dependência). Essa pasta **não deve ser versionada**, por isso ela está mapeada no `.gitignore`.
  - Uma vez baixadas as dependências, ainda dentro do diretório `/app/frontend/`, execute o comando `ng serve --host 0.0.0.0`. Se tudo deu certo, você acessa o frontend na sua máquina no endereço `localhost:4200`


- Buildar o o frontend para exercutar o backend
  - Basta abrir o diretório `/app/frontend/` e executar o comando `ng build`. Tudo será colocado dentro da pasta `dist`. Essa pasta também é mapeada no `.gitignore`.

- Executar o backend
  - Agora abra o diretório `/app/server/` e execute o comando `mvn spring-boot:run`. Esse comando vai copiar a pasta `dist` do frontend e servir o sistema completo no endereço `localhost:8080`
  - Além disso, esse comando vai baixar todas as dependencias do backend para dentro da pasta `m2`. Essa pasta também **não deve ser versionada** e, portanto, é mapeada no `.gitignore`.
  

## Criando um usuário no Amamenta

Como o Amamenta funcionando no endereço `localhost:8080` você pode criar um usuário na tela de cadastro. Porém, esse usuário não pode acessar o sistema pois é necessário que um Admin libere o uso. Porém, você tem acesso ao banco de dados via PHPMyAdmin, logo, você consegue alterar tudo dentro do banco na fonte.

Por exemplo, se você acabou de cadastrar um usuário chamado `cassian` e deseja liberar esse usuário, basta acessar o PHPMyAdmin, ir na tabela de usuário e trocar a colona `apto` para 1. Agora ele possui acesso ao sistema. Porém, por padrão, todo usuário é cadastrado com o nível `USER` e isso limita o que ele pode fazer no sistema. Você pode procurar a coluna `papel` e trocar para `ADMIN` (que vira um administrador do sistema e pode gerenciar determinadas coisas) ou, como você é desenvolvedor, `SUPER` que é o acesso total a tudo que o sistema oferece.

Tenha em mente que esse **banco é local**, ou seja, você pode fazer o que quiser com ele, menos compartilhar ele para fora do projeto. Além disso, sempre que você destruir o container `amamenta-backfront` tudo que foi alterado é perdido. Se você quiser manter, é necessário fazer um dump no SQL e sobrescrever o arquivo que você baixou no passo 1.

Uma outra opção, caso não queira criar um usuário novo, é utilizar o usuário padrão `padti` com senha `123123`.
