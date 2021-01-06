import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnChanges } from "@angular/core";
import { EditorRenderingService } from "../../../track-editor/renderingService/editor-rendering.service";
import { Track } from "../../../track/track";

const IMAGE_WIDTH: number = 300;
const IMAGE_HEIGTH: number = 300;

@Component({
  selector: "app-track-overview",
  templateUrl: "./track-overview.component.html",
  styleUrls: ["./track-overview.component.css"]
})
export class TrackOverviewComponent implements AfterViewInit, OnChanges {

  @ViewChild("container")
    private _containerRef: ElementRef;

  // tslint:disable-next-line:no-unused-variable justification: variable utilise dans track-detail.component.html
  @Input() private track: Track;

  public constructor(private editorRenderingService: EditorRenderingService) { }

  // code a ameliorer une fois editorRenderingService est clean
  public ngAfterViewInit(): void {

    this.editorRenderingService.initialize(this._containerRef.nativeElement);

    this.editorRenderingService.renderer.setSize(IMAGE_WIDTH, IMAGE_HEIGTH);

    this.generateTrack();
  }

  public ngOnChanges(): void {

    this.editorRenderingService.removeTrackInDisplay();
    this.generateTrack();
  }

  private generateTrack(): void {
    for (const i of this.track.points) {
      this.editorRenderingService.generatePointInDisplay(i.pointCoordinates);
    }

    for (let i: number = 0; i < this.track.segments.length; i++) {
      this.editorRenderingService.generateSegmentInDisplay( this.track.segments[i].startingPoint,
                                                            this.track.segments[i].directionVector, i, true);
    }
  }

}
