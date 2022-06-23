Os softwares deste repositório foram mostrados como estudo de caso nas gravações das aulas da pós-graduação na disciplina de “Desenvolvimento de Microsserviços”.
## 🛠 Stack Inicial
Stack para desenvolvimento backend: **NodeJs**, **Nestjs**, **MongoDB**, **RabbitMQ**. 
- Nodejs pode ser baixado em https://nodejs.org.
- A documentação do Nestjs pode ser encontrada em: https://docs.nestjs.com
- Todos os aplicativos precisam de uma conexão com MongoDB, e para isso nas aulas foi utilizado o provedor https://www.mongodb.com utilizando o serviço MongoDB Atlas. - [Referência para Nestjs+MongoDB](https://medium.com/weekly-webtips/building-modern-backendusing-nest-js-and-mongodb-96fd04f4b050) 
- No aplicativo final “delivery-rabbit” foi utilizado o serviço do RabbitMQ disponibilizado no provedor Amazon. https://aws.amazon.com/pt/amazon-mq/  - [Referência Nestjs+RabbitMQ](https://towardsdev.com/using-amazon-mq-with-nestjs-micro-services-32faae7acb3a)


## Aprendizado

Todos os softwares foram criados para estudos, então “bugs” no código ou na arquitetura são considerados bem-vindos para que o aluno possa se aprofundar no código e efetuar seus testes. 
## Versões do Nodejs, NestJs
    node -v v16.7.0
    nest -v 8.2.6 

## Deploy “delivery-backend”
#### O aplicativo “delivery-backend” é um monolíto REST API desenvolvido em NestJS. Será a base para o desenvolvimento do segundo app. Para iniciar este aplicativo todas as dependências devem estar instaladas.
Entre no diretório do projeto

```bash
  cd delivery-backend
```
```bash
  npm install 
```
```bash
  npm run start:dev 
```

## Deploy do projeto "delivery-micro”
#### O segundo aplicativo “delivery-micro” é um a derivação do monolito REST API. A ideia foi transformá-lo em microsserviços desacoplados. É Densenvolvido sobre uma arquitetura mono-repo e para dar start a um serviço específico siga os passos abaixo. 
Entre no diretório do projeto

```bash
  cd delivery-micro
```
```bash
  npm install 
```
Necessário utilizar terminais diferentes para o próximo passo:
```bash
  npm run start:dev auth
  npm run start:dev restaurantes 
  npm run start:dev pedidos 
```
## Deploy do projeto “delivery-rabbit”
#### O terceiro aplicativo “delivery-rabbit” é a derivação do segundo aplicativo “delivery-micro”. A ideia principal é utilizar um Message Broker para comunicação utilizando a estratégia de “Backend For Front-End” (BFF). Nosso Message Broker é o RabbitMQ utilizamos ele hospedado no provedor Amazon. O projeto é constituído por API GATEWAY como cliente de conexão e por este lidar com as requisições aos três microsserviços desenvolvidos (autenticação, restaurantes, pedidos). O projeto também está em uma arquitetura mono-repo e para dar start a um serviço específico deve-se usar os comandos abaixo.
- No projeto “delivery-rabbit” existe a adição de um API gateway
```bash
  cd delivery-rabbit
```
```bash
  npm install 
```
Necessário utilizar terminais diferentes para o próximo passo:
```bash
  npm run start:dev api-gateway
  npm run start:dev auth
  npm run start:dev restaurantes 
  npm run start:dev pedidos 
```
Tenham ótimos estudos!!
## Autor

- [@hallanpagani](https://github.com/hallanpagani)
