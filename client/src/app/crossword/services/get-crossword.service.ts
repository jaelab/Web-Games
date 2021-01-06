import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/toPromise";

import { CrosswordMessage } from "../../../../../common/communication/crosswordMessage";

@Injectable()
export class GetCrosswordService {

  private readonly BASE_URL: string = "http://localhost:3000/";
  public constructor(private _http: HttpClient) { }

  public async getCrosswordFromServer(difficulty: string): Promise<CrosswordMessage> {
    return this._http.get<CrosswordMessage>(this.BASE_URL + "api/crossword/" + difficulty).toPromise();
  }
}
