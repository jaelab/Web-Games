import "reflect-metadata";
import { injectable } from "inversify";
import { Word } from "../../../../../../common/communication/word";
import request = require("request");
import { MongoClient, Db, Collection, FilterQuery } from "mongodb";

const MONGODB_URL: string = "mongodb://projet:kegaub@ds046357.mlab.com:46357/log2990-23";
const URL_LEXICAL_SERVICE: string = "http://localhost:3000/api/crossword/lexical";

export interface MongoDbWordDB {
  listOfWord: string[];
}

@injectable()
export class GridLexicalSerivce {

  public async requestDefinitionFromAPI(word: Word, frequence: string): Promise<string> {
    return new Promise<string>((resolve: Function, reject: Function) => {
      request(URL_LEXICAL_SERVICE + "/definition/" + frequence + "/" + encodeURIComponent(word._word),
              (error: Error, response: request.Response, body: string) => {
        (JSON.parse(body) !== "Bad Request - Invalid URL") ? resolve(JSON.parse(body)) : reject("This word does not exist");
      });
    });
  }

  private arangeRequest(documents: MongoDbWordDB[]): string[][] {
    const listOfWord: string[][] = [];
    documents.forEach((document: MongoDbWordDB) => listOfWord.push(document.listOfWord));
    listOfWord.sort((words1: string[], words2: string[]) => words1[0].length - words2[0].length);

    return listOfWord;
  }

  public async requestWordsFromDB(frequence: string): Promise<string[][]> {
    return new Promise<string[][]>(async (resolve: Function, reject: Function) => {
      MongoClient.connect(MONGODB_URL, async (error: Error, db: MongoClient) => {
        const dbo: Db = db.db("log2990-23");
        const collection: Collection = dbo.collection("WordsDataBase");

        try {
          const isCommun: boolean = frequence === "common";
          const query: FilterQuery<MongoDbWordDB> = {"common": isCommun};
          const option: Object = {_id: 0, listOfWord: 1};
          const wordDb: MongoDbWordDB[] = await collection.find<MongoDbWordDB>(query).project(option).toArray();
          const listOfWord: string[][] = this.arangeRequest(wordDb);
          resolve(listOfWord);

        } catch (err) {
          reject(undefined);
        }

        await db.close();
      });
    });
  }
}
