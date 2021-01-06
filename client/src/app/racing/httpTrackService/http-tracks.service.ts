import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { TracksMessage } from "../../../../../common/communication/tracksMessage";
import { Track } from "../track/track";

@Injectable()
export class HttpTracksService {

  private readonly BASE_URL: string = "http://localhost:3000/";
  public constructor(private http: HttpClient) { }

  public async getCurrentTrack(trackName: string): Promise<Track> {
    if (trackName !== "NoTrackHereNewTrack") {
      const tracksMessage: TracksMessage = await this.getOneTrackFromServer(trackName);

      return new Track(tracksMessage.tracks[0]);
    }

    return new Track();
  }

  public getTracksFromServer(): Observable<TracksMessage> {
    return this.http.get<TracksMessage>(this.BASE_URL + "admin/tracks").pipe(
      catchError(this.handleError<TracksMessage>("getTracksFromServer"))
    );
  }

  public postTrackOnServer(track: Track): Observable<TracksMessage> {
    return this.http.post<TracksMessage>(this.BASE_URL + "admin/track/save", track).pipe(
      catchError(this.handleError<TracksMessage>("postTrackOnServer"))
    );
  }

  public deleteTrackOnServer(track: Track): Observable<{}> {
    return this.http.delete(this.BASE_URL + "admin/delete/" + track.name).pipe(
      catchError(this.handleError<TracksMessage>("deleteTrackOnServer"))
    );
  }

  public async getOneTrackFromServer(trackName: string): Promise<TracksMessage> {
    return this.http.get<TracksMessage>(this.BASE_URL + "admin/track/" + trackName).toPromise();
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }

}
