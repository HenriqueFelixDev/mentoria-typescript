export interface HttpGetParams<T> {
    url: string,
    method: string,
    body?: T | null
}

export class HttpClient {
    static async get<T>({url, method, body = null} : HttpGetParams<T>) {
      return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url, true);
  
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) {
            resolve(JSON.parse(request.responseText));
          } else {
            reject({
              status: request.status,
              statusText: request.statusText
            })
          }
        }
        request.onerror = () => {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }

        let serializedBody: string | null = null
        if (body) {
          request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          serializedBody = JSON.stringify(body);
        }
        request.send(serializedBody);
      })
    }
}