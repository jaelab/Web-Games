import { API_URL , API_KEY, API_DEFINITION_OPTIONS } from "./config";
import "reflect-metadata";
import { injectable } from "inversify";
import request = require("request");

const CORRECT_STATUS: number = 200;

export interface DefinitionObjectApi {
    text: string;
}

@injectable()
export class LexicalService {

  private isAlphabetic(word: string): boolean {
    word = word.toLocaleLowerCase();
    for (let i: number = 0; i < word.length; i++) {
      if (word.charCodeAt(i) < "a".charCodeAt(0) || word.charCodeAt(i) > "z".charCodeAt(0)) {
        return word.charAt(i) === "?";
      }
    }

    return true;
  }

  public async getDefinition(word: string, isEasyDifficulty: boolean): Promise<string> {
    return new Promise<string>((resolve: Function, reject: Function) => {
      if (!this.isAlphabetic(word)) {
        reject(this.errorHandling("is not alphabetic"));

      } else {
        request(API_URL + word + API_DEFINITION_OPTIONS + API_KEY, (error: Error, response: request.Response, body: string) => {
          if (response.statusCode === CORRECT_STATUS) {
            let definitions: DefinitionObjectApi[] = JSON.parse(body);
            definitions = definitions.filter((definition: DefinitionObjectApi) => definition.text !== undefined);

            if (definitions[0] === undefined) {
              resolve("No definition found");
            } else {
              isEasyDifficulty || definitions[1] === undefined ? resolve(definitions[0].text) : resolve(definitions[1].text);
            }

          } else {
            reject(this.errorHandling("error"));
          }

        });
      }
    });
  }

  private errorHandling(error: string): Error {
    if (error === "is not alphabetic") {
      return Error("Error - The entered word is not alphabetic");
    }

    return Error("Error - Something went wrong");
  }
}
