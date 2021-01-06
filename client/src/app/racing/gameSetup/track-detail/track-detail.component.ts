import { Component, OnInit, Input } from "@angular/core";
import { Track } from "../../track/track";

@Component({
  selector: "app-track-detail",
  templateUrl: "./track-detail.component.html",
  styleUrls: ["./track-detail.component.css"]
})
export class TrackDetailComponent implements OnInit {

  // tslint:disable-next-line:no-unused-variable justification: variable utilise dans track-detail.component.html
  @Input() private track: Track;

  public constructor() { }

  public ngOnInit(): void {
  }

}
