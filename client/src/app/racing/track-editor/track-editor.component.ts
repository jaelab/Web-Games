import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { Track } from "../track/track";
import { EditorRenderingService } from "./renderingService/editor-rendering.service";
import { TrackValidatorService } from "../track/trackValidatorService/track-validator.service";
import { Vector3 } from "three";
import { HttpTracksService } from "../httpTrackService/http-tracks.service";
import { ActivatedRoute } from "@angular/router";
import { TracksMessage } from "../../../../../common/communication/tracksMessage";

const LEFT_CLICK: number = 0;
const RIGHT_CLICK: number = 2;
const MIN_POSSIBLE_POINT_FOR_LOOP: number = 3;

@Component({
  selector: "app-track-editor",
  templateUrl: "./track-editor.component.html",
  styleUrls: ["./track-editor.component.css"]
})

export class TrackEditorComponent implements AfterViewInit, OnInit {

  @ViewChild("container")
  private _containerRef: ElementRef;
  private _draggingPointIndex: number;
  private _editedTrack: Track;
  private _isDragging: Boolean;

  public constructor(
    private editorRenderer: EditorRenderingService,
    private validator: TrackValidatorService,
    private _httpTracksService: HttpTracksService,
    private _route: ActivatedRoute ) {
      this._editedTrack = new Track;
      validator = new TrackValidatorService();
      this._isDragging = false;
  }

  public async ngOnInit(): Promise<void> {
    await this.getCurrentTrack();
    this.loadTrack(this._editedTrack);
    this.validator.attachTrackToValidate(this._editedTrack);
  }

  public ngAfterViewInit(): void {
    this.editorRenderer.initialize(this._containerRef.nativeElement);
  }

  public addPoint( pointToAdd: Vector3 ): void {
    this._editedTrack.addNextPointToTrackData( pointToAdd );
    this.editorRenderer.generatePointInDisplay( pointToAdd );
    if (this._editedTrack.points.length > 1 ) {
      // tslint:disable-next-line:no-magic-numbers
      this.addSegment( this._editedTrack.points[this._editedTrack.points.length - 2 ].pointCoordinates, pointToAdd );
    }
  }

  public removeLastPoint(): void {
    this.editorRenderer.removeLastPointInDisplay();
    this._editedTrack.points.pop();
  }

  public removeLastSegment(): void {
    this.editorRenderer.removeLastSegmentInDisplay();
    this._editedTrack.removeLastSegment();
  }

  public addSegment( startPoint: Vector3, endPoint: Vector3 ): void {
    this._editedTrack.addNextSegmentToTrackData( startPoint, endPoint );
    this.editorRenderer.generateSegmentInDisplay( startPoint, this._editedTrack.segments
                                                  [this._editedTrack.segments.length - 1 ].directionVector,
                                                  this._editedTrack.segments.length - 1, true);
    this.processInvalidSegments();
  }

  private updtateLinesPositionOnDrag(): void {
    for ( let i: number = this._draggingPointIndex - 1; i < this._draggingPointIndex + 1; i = i + 1 ) {
      let j: number = i;
      if (i === this._editedTrack.segmentAmount() && !this._editedTrack.points[this._draggingPointIndex].isLast) {
        j = i % this._editedTrack.segmentAmount(); }
      if (i < 0 && this._editedTrack.points[this._draggingPointIndex].isFirst && this._editedTrack.isCompleteLoop) {
        j = this._editedTrack.segmentAmount() - 1 ; }
      if (j >= 0 && j <= this._editedTrack.segmentAmount()) {
        this._editedTrack.segments[j].modifySegmentData( this._editedTrack.points[ j ].pointCoordinates,
                                                         this._editedTrack.points[(i + 1) % this._editedTrack.points.length]
                                                         .pointCoordinates);
        if (this._editedTrack.segments[j].isValid) {
          this.editorRenderer.generateSegmentInDisplay( this._editedTrack.segments[ j ].startingPoint,
                                                        this._editedTrack.segments[j].directionVector, j, true ); }
      }
      if (this._editedTrack.points[this._draggingPointIndex].isLast) {
        i++; }
    }
  }

  private fusionFirstLastPoint(): void {
    this._editedTrack.isCompleteLoop = true;
    if (!this._isDragging) {
    this.addSegment(this._editedTrack.lastPointInArray().pointCoordinates,
                    this._editedTrack.points[0].pointCoordinates);
    } else {
      this.removeLastPoint();
      this._editedTrack.segments[this._editedTrack.segments.length - 1 ]
        .modifySegmentData(this._editedTrack.points[this._editedTrack.points.length - 1 ].pointCoordinates,
                           this._editedTrack.points[0].pointCoordinates);
    }
    this._editedTrack.lastPointInArray().isLast = false;
  }

  public processInvalidSegments(): void {
    this.validator.updateValidityParameters();
    for (let i: number = 0; i < this._editedTrack.segments.length ; i++) {
      this.editorRenderer.generateSegmentInDisplay(this._editedTrack.segments[i].startingPoint,
                                                   this._editedTrack.segments[i].directionVector,
                                                   i, this._editedTrack.segments[i].isValid);
    }
  }

  public loadTrack( trackToLoad: Track ): void {
    this._editedTrack = trackToLoad;
    for (const i of this._editedTrack.points) {
      this.editorRenderer.generatePointInDisplay(i.pointCoordinates);
    }
    for (let i: number = 0; i < this._editedTrack.segments.length; i++) {
      this.editorRenderer.generateSegmentInDisplay( this._editedTrack.segments[i].startingPoint,
                                                    this._editedTrack.segments[i].directionVector, i, true);
    }
  }

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.editorRenderer.onResize();
  }

  public onSelect(event: MouseEvent): void {
    if (event.button === LEFT_CLICK) {
      const intersection: Vector3 = this.editorRenderer.clickPositionOnPoint(event);
      if (intersection) {
        this._draggingPointIndex = this.editorRenderer.getPointIndex();
        if (this._draggingPointIndex === 0 && this._editedTrack.points.length >= MIN_POSSIBLE_POINT_FOR_LOOP &&
           !this._editedTrack.isCompleteLoop) {
          this.fusionFirstLastPoint(); } else { this._isDragging = true; }
      }
    }
  }

  public onDrag(event: MouseEvent): void {
    if ( this._isDragging && event.button === LEFT_CLICK) {
      this.editorRenderer.onDrag(event, this._draggingPointIndex);
      this._editedTrack.points[this._draggingPointIndex].pointCoordinates =
        this.editorRenderer.clickPositionOnPlan( event );
      this._editedTrack.recalculateTrackLength();
      this.updtateLinesPositionOnDrag();
      this.processInvalidSegments();
    }
  }

  public onMouseUp(event: MouseEvent): void {
    const intersection: Vector3 = this.editorRenderer.clickPositionOnPlan( event );
    if ( event.button === LEFT_CLICK ) {
      if (this._isDragging) {
        if (this._editedTrack.isCompleteLoop) {
          if (this._editedTrack.points.length !== this._editedTrack.segmentAmount()) {
            this.fusionFirstLastPoint(); }
        }
        this._isDragging = false;
      } else if ( !this._editedTrack.isCompleteLoop ) {
        this.addPoint( intersection ); }
    }
    if (event.button === RIGHT_CLICK) {
      if (this._editedTrack.isCompleteLoop) {
        this.removeLastSegment();
        this._editedTrack.isCompleteLoop = false; } else {
        this.removeLastPoint();
        if ( this._editedTrack.points.length >= 1 ) {
          this.removeLastSegment(); }
      }
    }
    this.processInvalidSegments();
  }

  // tslint:disable-next-line:no-unused-variable justification: methode utilise dans track-editor.component.html
  private saveTrack(addedName: string, addedDescription: string): void {
    this._httpTracksService.postTrackOnServer(this._editedTrack).subscribe(() => {
    });
    window.location.href = "http://localhost:4200/admin";
  }

  private async getCurrentTrack(): Promise<void> {
    const trackName: string = this._route.snapshot.paramMap.get("_trackName");
    if (trackName !== "NoTrackHereNewTrack") {
      const tracksMessage: TracksMessage = await this._httpTracksService.getOneTrackFromServer(trackName);
      this._editedTrack = new Track(tracksMessage.tracks[0]);
    }
  }

}
