import { HttpClient } from "../entities/httpClient.js";

type AuthChangedCallback = (credenciais: CredenciaisAutenticacao) => void

export interface ICredenciais {
    apiKey?: string
    requestToken?: string;
    sessionId?: string;
}

interface RequestTokenResult {
    expires_at: string
    request_token: string
    success: boolean
}

interface SessionResult {
    session_id: string
    success: boolean
}

export type CredenciaisAutenticacao = {
    +readonly [K in keyof ICredenciais]-?: ICredenciais[K]
}

const AUTH_STORAGE_KEY = '@Movies:auth'

export class AuthRepository  {
    authListeners: AuthChangedCallback[] = []
    credenciais: ICredenciais = {}

    constructor() {
        const serializedCredentials = localStorage.getItem(AUTH_STORAGE_KEY)
        if (serializedCredentials) {
            this.credenciais = JSON.parse(serializedCredentials) as ICredenciais || {}
        }
    }

    private async criarRequestToken () {
      let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${this.credenciais.apiKey}`,
        method: "GET"
      }) as RequestTokenResult
      
      this.credenciais.requestToken = result.request_token
    }
      
    private async validarToken(username: string, password: string) {
      await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${this.credenciais.apiKey}`,
        method: "POST",
        body: {
          username: `${username}`,
          password: `${password}`,
          request_token: `${this.credenciais.requestToken}`
        }
      })
    }
      
    private async criarSessao() {
      let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${this.credenciais.apiKey}&request_token=${this.credenciais.requestToken}`,
        method: "GET"
      }) as SessionResult
      
      this.credenciais.sessionId = result.session_id;
    }
      
    public async logar(username: string, password: string, apiKey: string): Promise<CredenciaisAutenticacao> {
      this.credenciais.apiKey = apiKey

      await this.criarRequestToken();
      await this.validarToken(username, password);
      await this.criarSessao();

      const readOnlyCredencials = this.credenciais as CredenciaisAutenticacao
      
      for(const listener of this.authListeners) {
        listener(readOnlyCredencials)
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(readOnlyCredencials))

      return readOnlyCredencials
    }
      
    public addOnAuthChanged(callback: AuthChangedCallback): void {
      this.authListeners.push(callback)
    }

    public getCredenciais() {
        return this.credenciais
    }

}