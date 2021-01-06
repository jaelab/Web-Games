import { Component , OnInit} from "@angular/core";
import { Track } from "../track/track";

import { HttpTracksService } from "../httpTrackService/http-tracks.service";
import { TracksMessage } from "../../../../../common/communication/tracksMessage";

@Component({
  selector: "app-admin",
  styleUrls: ["./admin.component.css"],
  templateUrl: "./admin.component.html",
})

export class AdminComponent implements OnInit {

  private _trackList: Track[];

  public constructor(private _httpTracksService: HttpTracksService) { }

  public ngOnInit(): void {
    this.getTracks();
  }

  private getTracks(): void {
    this._httpTracksService.getTracksFromServer().subscribe((tracksMessage: TracksMessage) => {
      this._trackList = tracksMessage.tracks;
    });
  }

  // tslint:disable-next-line:no-unused-variable justification: methode utilise dans admin.component.html
  private deleteTrack(trackToDelete: Track): void {
    this._httpTracksService.deleteTrackOnServer(trackToDelete).subscribe();
    this.updateTrackList(trackToDelete);
  }

  private updateTrackList(trackToDelete: Track): void {
    this._trackList = this._trackList.filter((track: Track) => {
      if (track.name === trackToDelete.name) {
        return false;
      }

      return true;
    });
  }

  // tslint:disable-next-line:no-unused-variable justification: methode utilise dans admin.component.html
  private openEditor(trackToEdit: Track): void {
    window.location.href = "http://localhost:4200/admin/trackeditor/" + trackToEdit.name;
  }
}
