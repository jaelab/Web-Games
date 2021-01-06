import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { TracksMessage } from "../../../../common/communication/tracksMessage";
import { MongoClient, Db, Collection } from "mongodb";
import { Track } from "../../../../client/src/app/racing/track/track";

const mongoURL: string = "mongodb://projet:kegaub@ds046357.mlab.com:46357/log2990-23";

export interface MongoDBTrack {
  track: Track;
}

@injectable()
export class AdminMessenger {

  public insertTrack(req: Request, res: Response, next: NextFunction): void {
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection("Tracks");

      try {
        const track: Track = req.body;
        await collection.replaceOne({"track.name": track.name}, {track}, { upsert: true });
        console.log("Track inserted!");

      } catch (err) {
        Error(err);
      }

      await db.close();
    });
  }

  private arrangeRequest(documents: MongoDBTrack[]): TracksMessage {
    const tracksMessage: TracksMessage = new TracksMessage;
    documents.forEach( (doc: MongoDBTrack) => {
      tracksMessage.tracks.push(doc.track);
    });

    return tracksMessage;
  }

  public sendOneTrack(req: Request, res: Response, next: NextFunction): void {
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection("Tracks");

      try {
        const track: MongoDBTrack[] = await collection.find<MongoDBTrack>({"track.name": req.params._trackName})
        .project({"_id": 0}).toArray();
        const response: TracksMessage = this.arrangeRequest(track);
        res.send(response);
        console.log("track sent!");

      } catch (err) {
        res.send(err);
        Error(err);
      }

      await db.close();
    });

  }

  public sendTracks(req: Request, res: Response, next: NextFunction): void {
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection("Tracks");

      try {
        const tracksDocument: MongoDBTrack[] = await collection.find({}).project({"_id": 0}).toArray();
        const response: TracksMessage = this.arrangeRequest(tracksDocument);
        res.send(response);
        console.log("tracks sent!");

      } catch (err) {
        res.send(err);
        Error(err);
      }

      await db.close();
    });
  }

  public deleteTrack(req: Request, res: Response, next: NextFunction): void {
    MongoClient.connect(mongoURL, async (error: Error, db: MongoClient) => {
      const dbo: Db = db.db("log2990-23");
      const collection: Collection = dbo.collection("Tracks");

      try {
        await collection.deleteOne({"track.name": req.params.track});
        res.send("track deleted");
        console.log("track deleted");

      } catch (err) {
        res.send(err);
        Error(err);
      }

      await db.close();
    });
  }
}
