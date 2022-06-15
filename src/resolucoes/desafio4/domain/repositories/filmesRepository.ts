import { IFilmesResult } from "../entities/filme.js"
import { HttpClient } from "../entities/httpClient.js"
import { AuthRepository, CredenciaisAutenticacao } from "./authRepository.js";

export class FilmesRepository {
  authRepository: AuthRepository
  listId = '7101979';

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
    
  public async procurarFilme(query: string): Promise<IFilmesResult> {
      query = encodeURI(query)
      let result = await HttpClient.get({
          url: `https://api.themoviedb.org/3/search/movie?api_key=${this.authRepository.getCredenciais().apiKey}&query=${query}`,
          method: "GET"
      })
  
      return result as IFilmesResult
  }

  public async adicionarFilme(filmeId: number) {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${this.authRepository.getCredenciais().apiKey}&language=en-US`,
      method: "GET"
    })
    console.log(result);
  }

  public async criarLista(nomeDaLista: string, descricao: string) {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/list?api_key=${this.authRepository.getCredenciais().apiKey}&session_id=${this.authRepository.getCredenciais().sessionId}`,
      method: "POST",
      body: {
        name: nomeDaLista,
        description: descricao,
        language: "pt-br"
      }
    })
    console.log(result);
  }

  public async adicionarFilmeNaLista(filmeId: number, listaId: number) {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${this.authRepository.getCredenciais().apiKey}&session_id=${this.authRepository.getCredenciais().sessionId}`,
      method: "POST",
      body: {
        media_id: filmeId
      }
    })
    console.log(result);
  }
  
  public async obterMinhaListaDeFilmes() {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/list/${this.listId}?api_key=${this.authRepository.getCredenciais().apiKey}`,
      method: "GET"
    })
    console.log(result);
  }
}