# 2025.2 Valhalla — Guardiões da Universidade
![Logo](Front/public/logos/Logo-Navbar.svg)


## Sobre

O **Guardiões da Universidade**, desenvolvido pelo grupo **Valhalla** no 2° semestre de 2025 na disciplina *Métodos de Desenvolvimento de Software*, tem como objetivo oferecer um **canal de denúncias e orientação** para a comunidade acadêmica da *Universidade de Brasília (UnB)*.  
A plataforma permite que alunos e servidores relatem situações, conheçam os procedimentos oficiais e acompanhem informações sobre demandas da universidade.

### ⚠️ Observação Importante

Por questões legais, a UnB **não pode receber denúncias por plataformas não oficiais** regulamentadas pelo Governo Federal.  
Dessa forma, o Guardiões da Universidade **não registra denúncias oficialmente**, atuando apenas como um **meio de apoio e desburocratização**. Esse também foi o motivo da escolha do nome do projeto.

---

<div align="center">

[![Acessar Documentação](https://img.shields.io/badge/Acessar_Documentação-3060BF?style=for-the-badge&logo=github&logoColor=white)](https://fga-eps-mds.github.io/2025.2-Valhalla-Docs/)

</div>


--- 
## Tecnologias Utilizadas
* **Front-end:** React, TypeScript, TailwindCSS
* **Back-end:** Node.js, TypeScript
* **Banco de Dados:** PostgreSQL, ORM Prisma
* **Outras Ferramentas:** Jest

---
## Instalação

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/fga-eps-mds/2025.2-Valhalla.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd 2025.2-Valhalla
    ```
3.  **Instale as dependências do Front-end:**
    ```bash
    cd Front
    npm install
    ```
4.  **Instale as dependências do Back-end:**
    ```bash
    cd ../Back
    npm install
    ```
5.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na pasta `Back` e adicione as seguintes variáveis:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    JWT_SECRET="your_jwt_secret"
    ```
    Substitua `user`, `password`, `host`, `port` e `database` pelas suas credenciais do PostgreSQL. `your_jwt_secret` deve ser uma string segura e aleatória.

6.  **Execute as migrações do banco de dados:**
    ```bash
    cd Back
    npx prisma migrate dev --name init
    ```
7.  **Inicie o Back-end:**
    ```bash
    npm run dev
    ```
8.  **Inicie o Front-end:**
    Abra um novo terminal, navegue até a pasta `Front` e execute:
    ```bash
    npm run dev
    ```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, dependendo da configuração do seu ambiente).

---

### Equipe de Desenvolvimento

## Equipe

<div align="center">

<table>
  <tr>
    <td align="center">
      <img src="/Front/public/devs/antonio.jpeg" width="100"><br>
      <strong>Antonio Lucas</strong><br>
      Matrícula: 241025597<br>
      <a href="https://github.com/Devv-Antonio">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/diniz.jpeg" width="100"><br>
      <strong>Gabriel Diniz</strong><br>
      Matrícula: 241025630<br>
      <a href="https://github.com/GabrielDiniz12">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/Bonifacio.jpg" width="100"><br>
      <strong>Julia Gabriella</strong><br>
      Matrícula: 241025659<br>
      <a href="https://github.com/Gustavo27033">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/Front/public/devs/julia.jpg" width="100"><br>
      <strong>Julia Gabriella</strong><br>
      Matrícula: 241036142<br>
      <a href="https://github.com/juliagabriellafs">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/laura.jpg" width="100"><br>
      <strong>Laura Rogelin</strong><br>
      Matrícula: 222006928<br>
      <a href="https://github.com/laurarogelin">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/gepeto.jpg" width="100"><br>
      <strong>Lucas Alves</strong><br>
      Matrícula: 241025541<br>
      <a href="https://github.com/xLucasMelo">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/Front/public/devs/luquinhas.jpg" width="100"><br>
      <strong>Lucas Oliveira</strong><br>
      Matrícula: 241011386<br>
      <a href="https://github.com/dev-LucasDpaula">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/ian.jpeg" width="100"><br>
      <strong>Pedro Ian</strong><br>
      Matrícula: 241025837<br>
      <a href="https://github.com/pedroiaan">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
    <td align="center">
      <img src="/Front/public/devs/americo.jpeg" width="100"><br>
      <strong>Pedro Henrique</strong><br>
      Matrícula: 241025980<br>
      <a href="https://github.com/dev-americo">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/Front/public/devs/pedrin.jpg" width="100"><br>
      <strong>NOME 10</strong><br>
      Matrícula: 241025710<br>
      <a href="https://github.com/Pwdrinho">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28">
      </a>
    </td>
  </tr>

</table>

</div>
