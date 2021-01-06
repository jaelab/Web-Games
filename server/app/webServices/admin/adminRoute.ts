import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction  } from "express";
import { AdminMessenger } from "./adminMessenger";
import Types from "../../types";
import { AbsWebService } from "../absWebService";

@injectable()
export class AdminRoute extends AbsWebService {

  public readonly mainRoute: string = "/admin";
  public constructor(@inject(Types.AdminMessenger) private messenger: AdminMessenger) {
      super();
  }

  public get routes(): Router {
    const router: Router = Router();

    router.post("/track/save",
                async (req: Request, res: Response, next: NextFunction) => {
      this.messenger.insertTrack(req, res, next);
      res.send("Track send");
    });

    router.get("/tracks",
               async (req: Request, res: Response, next: NextFunction) => {
      this.messenger.sendTracks(req, res, next);
    });

    router.get("/track/:_trackName",
               async (req: Request, res: Response, next: NextFunction) => {
      this.messenger.sendOneTrack(req, res, next);
    });

    router.delete("/delete/:track",
                  async (req: Request, res: Response, next: NextFunction) => {
      this.messenger.deleteTrack(req, res, next);
    });

    return router;
  }
}
