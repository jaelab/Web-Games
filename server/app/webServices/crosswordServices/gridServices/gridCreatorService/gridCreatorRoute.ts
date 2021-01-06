import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction  } from "express";
import { GridCreatorMessenger } from "./gridCreatorMessenger";
import Types from "../../../../types";
import { AbsWebService } from "../../../absWebService";

@injectable()
export class GridCreatorRoute extends AbsWebService {

  public readonly mainRoute: string = "/api/crossword";

  public constructor(@inject(Types.GridCreatorMessenger) private messenger: GridCreatorMessenger) {
    super();
  }

  public get routes(): Router {
    const router: Router = Router();

    router.get("/:difficulty",
               async (req: Request, res: Response, next: NextFunction) => {
      res.on("finish", next);
      this.messenger.sendCrossword(req, res, next);
    });

    router.use("/:difficulty",
               async (req: Request, res: Response, next: NextFunction) => {
      await this.messenger.insertCrossword(req, res, next);
    });

    return router;
  }
}
