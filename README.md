#### Subindo o servidor
  1. Clone/Baixe este repositório na sua máquina;
  2. Se tiver o *``` docker-compose ```* instalado, abra o terminal na raiz da pasta do projeto e rode o comando *``` docker-compose up --build ```* para subir o servidor do projeto;
  2. Se não tiver o *``` docker-compose ```* instalado, abra o terminal na raiz da pasta do projeto e rode os comandos *``` yarn install ```* ou *``` npm install ```* para instalar as dependências do projeto, depois *``` yarn build ```* ou *``` npm run build ```* para buildar o projeto e depois o comando *``` yarn start:dev ```*  ou *``` npm run start:dev ```* para subir o container do projeto;
  4. Pronto, seu servidor backend está no ar e pronto pra ser acessado no endereço *``` http://localhost:3000 ```* ou na porta configurada.


## Rotas e Parâmetros

#### /rules
```
- Verbo: GET
- Rota para visualizar todas as regras cadastradas;
- Parâmetros: nenhum;
- Retorno: um array de regras ou um array vazio;
```

<img src="/assets/getRules.gif" height="500" width="1200">


#### /rules/available?since=dd-mm-yyyy&until=dd-mm-yyyy
```
- Verbo: GET
- Rota para visualizar os horários disponíveis de acordo com as datas informadas nos query params;
- Parâmetros: query param { since=12-01-2010, until=20-02-2010(opcional) }
- Retorno: um array de horários disponíveis organizados por data ou um array vazio;
```

<img src="/assets/availableHours.gif" height="500" width="1200">


#### /rules/daily
```
- Verbo: POST
- Rota para cadastrar uma nova regra diária;
- Parâmetros: body { "intervals": [{ "start": "12:00", "end": "13:00" }] }
- Retorno: um objeto com os dados da nova regra diária cadastrada;
```

#### /rules/byDate
```
- Verbo: POST
- Rota para cadastrar uma nova regra por data;
- Parâmetros: body { "date": "03-06-2021", "intervals": [{ "start": "15:00", "end": "16:00" }] }
- Retorno: um objeto com os dados da nova regra por data cadastrada;
```

#### /rules/weekly
```
- Verbo: POST
- Rota para cadastrar uma nova regra semanal;
- Parâmetros: body { "days": ["MON", "FRI"], "intervals": [{ "start": "16:00", "end": "17:00" }] }
- OBS: parâmetros aceitos no array "days": ["MON", "TUE", "WED", "THU", "FRI"];
- Retorno: um objeto com os dados da nova regra semanal cadastrada;
```

#### /rules/:id
```
- Verbo: DELETE
- Rota para remover uma regra por ID;
- Parâmetros: route param { /72a74117-bf14-4741-b4ad-e7d2b555e044 }
- Retorno: { "statusCode": 200, "message": "Rule Deleted Sucessfully!" }
```

#### Testando
  1. O comando *``` yarn test ```* ou *``` npm run test ```* testa a aplicação;
  

## Tecnologias Utilizadas no Projeto

| **Backend**|
|----------- |
| *NodeJS*   |
| *Express*    |
| *TypeScript* |
| *DateFNS*    |
| *NestJS* |
| *Eslint*     |
| *Prettier*  |
| *Docker*    |
