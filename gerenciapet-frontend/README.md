# Amamenta Frontend

O frontend do Amamenta é desenvolvido em Angular utilizando um template gratuito da [CoreUI](https://coreui.io/angular/). O tutorial para criar o ambiente de desenvolvimento usando docker [está descrito neste arquivo](https://github.com/pad-ufes/dockerfiles/tree/main/dev). As versões utilizadas são descritas a seguir:

- Nodejs 16.19
- Angular 15.1.1

Para entender mais sobre o template utilizado como base, é interessante que você acesse ao [README](https://github.com/coreui/coreui-free-angular-admin-template) disponibilizado pelos desenvolvedores do mesmo.


# Executando o frontend

Se você fez a instalação manual do Angular (**não recomendado**), é necessário instalar as depedências do projeto. Para isso, execute o comando `npm install` dentro da pasta do projeto. Se você está utilizando o ambiente criado dentro do Docker, não é necessário executar esse passo uma vez que isso é feito na criação da imagem. Sendo assim, todas as dependências serão baixadas. Lembrando que essas dependencias estão dentro do `.gitignore` e de maneira alguma devem ser versionadas (por isso usamos um gerenciador). 

Baixada as depêndencias, você pode servir apenas o frontend utilizando o comando `ng serve`, que por padrão, vai servir o projeto no endereço `localhost:4200`. Todavia, ao executar o servidor via Maven, o mesmo já copia a build do Angular e serve no `localhost:8080`.

Para melhor entender a integração entre o servidor e o frontend, dirija-se ao [repositório de documentação](https://github.com/pad-ufes/docs).


### Para aumentar sua produção
Um editor adequado para o uso do Angular é o [VScode](https://code.visualstudio.com/). Ele funciona tanto para Windows quanto para Linux.
É altamente recomendável que o instale e utilize os pacotes `Angular Extension Pack` (criado pela Loiane Groner) e `VSCode simpler Icons with Angular`.

### Documentaçao
A documentação do código Angular será realizado utilizando o [Compodoc](https://compodoc.app/guides/getting-started.html). O funcionamento dele é idêntico ao Javadoc e todas as informações necessárias são descritas em seu site. Para mais informações, dirija-se ao [repositório de documentação](https://github.com/pad-ufes/docs).

Além disso, o CoreUI fornece uma documentação interessante para as funcionalidades disponíveis no template. Alguns links úteis para desenvolver no frontend:
- [Documentação do CoreUI](https://coreui.io/angular/docs/getting-started/introduction): aqui você pode acessar o componente desejado, visualizar como ele funciona e ver um trecho de código da sua implementação
- [Live preview do CoreUI](https://coreui.io/demos/angular/4.2/free/#/dashboard): aqui é possível visualizar uma demostração de todos os componentes que o CoreUI fornece para que possamos desenvolver nosso sistema. É muito interessante utilizar para entender alguma funcionalidade ou se inspirar para construir algum item de uma página. Por exemplo, você pode visualizar como funciona uma tabela e depois implementar dentro do Amamenta
- [Código do live preview CoreUI](https://github.com/coreui/coreui-free-angular-admin-template): aqui você pode acessar o código fonte do live preview do CoreUI. É interessante ter na sua máquina para entender como um dado item funciona e transferir ele para o Amamenta

### Mais informações
* [Nodejs](https://nodejs.org/en/)
* [NPM](https://docs.npmjs.com/cli/install)
* [Angular](https://angular.io/)
* [CoreUI](https://coreui.io/angular/)
