// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction


import { IFilme } from '../domain/entities/filme.js';
import { FilmesRepository } from '../domain/repositories/filmesRepository.js';
import { createAuthRepository } from '../domain/factories/authRepositoryFactory.js'

let filmesRepository = new FilmesRepository(createAuthRepository())

const searchButton = document.getElementById('search-button') as HTMLButtonElement
const searchInput = document.getElementById('search') as HTMLInputElement

const criarListaDeFilmes = (filmes: IFilme[]) => {
  const searchContainerResult = document.getElementById('search-container-result') as HTMLElement
  searchContainerResult.innerHTML = ''

  for (const filme of filmes) {
    const filmeItem = document.createElement('article');
    filmeItem.classList.add('movie')

    const filmeImagem = document.createElement('img')
    filmeImagem.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    filmeImagem.alt = `Poster do filme ${filme.original_title}`

    const filmeTitle = document.createElement('h2')
    filmeTitle.textContent = filme.original_title

    const botaoAdicionarALista = `
      <button class="btn btn-primary">
        <i class="fa fa-star"></i>
        <span>Adicionar à Lista</span>
      </button>
    `

    const divInformacoesFilme = document.createElement('div')
    divInformacoesFilme.classList.add('movie__info')
    
    divInformacoesFilme.appendChild(filmeTitle)
    divInformacoesFilme.innerHTML += botaoAdicionarALista

    filmeItem.appendChild(filmeImagem)
    filmeItem.appendChild(divInformacoesFilme)
    searchContainerResult.appendChild(filmeItem)
  }
}

searchButton.addEventListener('click', async () => {
  let query = searchInput.value;

  if (!query || !query.trim()) {
    alert('O campo de pesquisa não pode estar vazio')
    return
  }

  try {
    let listaDeFilmes = await filmesRepository.procurarFilme(query);
    criarListaDeFilmes(listaDeFilmes.results)
  } catch (e: any) {
    if (e.status) {
      switch(e.status) {
        case 401:
          alert('Você precisa fazer o login')
          break
        case 422:
          alert('Pesquisa inválida!')
          break
        default:
          alert('Um erro inesperado ocorreu')
      }
      return
    }
    alert('Um erro inesperado ocorreu')
  }
})