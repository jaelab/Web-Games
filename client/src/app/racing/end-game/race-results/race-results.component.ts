import { Component, OnInit, Input } from "@angular/core";
import { PlayerService } from "../../gameplay/player-service/player.service";
import { HttpTracksService } from "../../httpTrackService/http-tracks.service";
import { Track } from "../../track/track";
import { Player } from "../../gameplay/player";
import { SortTableService } from "./sortTable-service/sort-table.service";

@Component({
  selector: "app-race-results",
  templateUrl: "./race-results.component.html",
  styleUrls: ["./race-results.component.css"]
})
export class RaceResultsComponent implements OnInit {

  @Input() public trackName: string;
  public currentTrack: Track;
  public players: Player[];
  public displayedColumns: string[] = ["name", "totalTime"];
  public sortedData: Player[];

  public constructor(public playerService: PlayerService,
                     private _httpService: HttpTracksService,
                     private _sortTableService: SortTableService ) { }

  public async ngOnInit(): Promise<void> {
    await this.getCurrentTrack();
    this.players = this.playerService.players;
    this.sortedData = this.players.slice();
    this.sortResults(this.sortedData);
  }

  private async getCurrentTrack(): Promise<void> {
    this.currentTrack = await this._httpService.getCurrentTrack(this.trackName);
  }

  private sortResults(players: Player[]): void {
    this._sortTableService.sortDataAsc(players);
  }

}
