import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import Types from "../../../../types";
import { GridCreatorService } from "./grid-creator.service";
import { MongoClient, Db, Collection } from "mongodb";
import { Crossword } from "../../../../../../common/communication/crossword";

const mongoURL: string = "mongodb://projet:kegaub@ds046357.mlab.com:46357/log2990-23";

@injectable()
export class GridCreatorMessenger {

  constructor(@inject(Types.GridCreatorService) private _gridCreatorService: GridCreatorService) {}

  public sendCrossword(req: Request, res: Response, next: NextFunction): void {
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection(req.params.difficulty + "Crossword");

      try {
        // tslint:disable-next-line:no-any
        const crosswordDocument: any  = await collection.findOneAndDelete({}, {projection: {_id: 0}});
        res.send(crosswordDocument.value);
        console.log("crossword sent!");

      } catch (err) {
        res.send(err);
      }

      await db.close();
    });
  }

  public async insertCrossword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const crossword: Crossword =  await this._gridCreatorService.postCrossWords(req.params.difficulty);
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection(req.params.difficulty + "Crossword");

      try {
        await collection.insertOne({crossword});
        console.log("crossword inserted!");

      } catch (err) {
        Error(err);
      }

      await db.close();
    });
  }
}
