import { Component, OnInit } from "@angular/core";
import { Track } from "../../track/track";
import { TracksMessage } from "../../../../../../common/communication/tracksMessage";
import { HttpTracksService } from "../../httpTrackService/http-tracks.service";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent implements OnInit {

  private selectedTrack: Track;

  private _trackList: Track[];

  public constructor(private _httpTracksService: HttpTracksService) { }

  public ngOnInit(): void {
    this.getTracks();
  }

  // tslint:disable-next-line:no-unused-variable justification: methode utilise dans track-list.component.html
  private onSelect(track: Track): void {
    this.selectedTrack = track;
  }

  private getTracks(): void {
    this._httpTracksService.getTracksFromServer().subscribe((tracksMessage: TracksMessage) => {
      this._trackList = tracksMessage.tracks;
    });
  }

}
