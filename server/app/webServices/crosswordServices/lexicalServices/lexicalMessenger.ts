import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, inject} from "inversify";
import { LexicalService } from "./lexical.service";
import Types from "../../../types";

@injectable()
export class LexicalMessenger {

  constructor(@inject(Types.LexicalService) private _lexicalService: LexicalService) {}

  public async sendDefinition(req: Request, res: Response, next: NextFunction, isCommon: boolean): Promise<void> {
    try {
      const definition: string = await this._lexicalService.getDefinition(req.params.word, isCommon);
      res.send(JSON.stringify(definition));
    } catch (error) {
      res.send(JSON.stringify(error));
    }
  }
}
