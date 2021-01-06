import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import Types from "./types";
import { injectable, inject } from "inversify";
import { LexicalRoute } from "./webServices/crosswordServices/lexicalServices/lexicalRoute";
import { GridCreatorRoute } from "./webServices/crosswordServices/gridServices/gridCreatorService/gridCreatorRoute";
import { AbsWebService } from "./webServices/absWebService";
import { AdminRoute  } from "./webServices/admin/adminRoute";

@injectable()
export class Application {

  private readonly internalError: number = 500;
  public app: express.Application;

  constructor(
  @inject(Types.LexicalRoute)   private lexicalRoute: LexicalRoute,
  @inject(Types.GridCreatorRoute) private gridCreatorRoute: GridCreatorRoute,
  @inject(Types.AdminRoute)   private adminRoute: AdminRoute) {
    this.app = express();

    this.config();
    this.addService(this.lexicalRoute);
    this.addService(this.gridCreatorRoute);
    this.addService(this.adminRoute);

    this.errorHandeling();
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "../client")));
    this.app.use(cors());
  }

  private addService(service: AbsWebService): void {
    this.app.use(service.mainRoute, service.routes);
  }

  private errorHandeling(): void {
    // Gestion des erreurs
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const err: Error = new Error("Not Found");
      next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get("env") === "development") {
      // tslint:disable-next-line:no-any
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || this.internalError);
        res.send({
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    // tslint:disable-next-line:no-any
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || this.internalError);
      res.send({
        message: err.message,
        error: {}
      });
    });
  }
}
