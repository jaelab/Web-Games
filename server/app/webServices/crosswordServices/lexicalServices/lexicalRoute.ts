import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction  } from "express";
import Types from "../../../types";
import { AbsWebService } from "../../absWebService";
import { LexicalMessenger } from "./lexicalMessenger";

const STATUS_404: number = 404;

@injectable()
export class LexicalRoute extends AbsWebService {

  public readonly mainRoute: string = "/api/crossword/lexical";

  public constructor(@inject(Types.LexicalMessenger) private messenger: LexicalMessenger) {
    super();
  }

  public get routes(): Router {
    const router: Router = Router();

    router.get("/definition/common/:word",
               async (req: Request, res: Response, next: NextFunction) => {
      await this.messenger.sendDefinition(req, res, next, true);
    });

    router.get("/definition/notCommon/:word",
               async (req: Request, res: Response, next: NextFunction) => {
      await this.messenger.sendDefinition(req, res, next, false);
    });

    router.use((req: Request, res: Response, next: NextFunction) => {
      res.type("text/plain");
      res.status(STATUS_404);
      res.send("404 - Not Found");
    });

    return router;
  }
}
