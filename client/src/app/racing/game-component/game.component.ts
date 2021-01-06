import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit, OnDestroy } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { EventHandlerService } from "../eventHandler-service/event-handler.service";
import { Car } from "../car/car";
import { PlayerService } from "../gameplay/player-service/player.service";
import { P, NUMBER_OF_PLAYERS, MAX_LAP } from "../constants/race-constants";
import { ActivatedRoute } from "@angular/router";
import { AudioService } from "../audio.service";
@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild("container")
    private containerRef: ElementRef;
    private _trackName: string;

    public constructor(private renderService: RenderService,
                       private _eventHandlerService: EventHandlerService,
                       private _route: ActivatedRoute,
                       public playerService: PlayerService,
                       private audioService: AudioService ) {}

    public async ngOnInit(): Promise<void> {
        this._trackName = this._route.snapshot.paramMap.get("_trackName");
        this.renderService.track3D.trackName = this._trackName;
        for (let i: number = 0; i < NUMBER_OF_PLAYERS; i++) {
            this.playerService.players[i].car = this.renderService.cars[i];
        }
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (!this.playerService.countdownService.isCountingDown &&
            this.playerService.players[P.Human].completedLap < MAX_LAP) {
            this.playerService.countdownService.removeCountdownMesh(); // enlever "GO" une fois le car a bouge
            this.renderService.carHandlerService.handleKeyDown(event);
            this._eventHandlerService.handleKeyDown(event);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.renderService.carHandlerService.handleKeyUp(event);
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(() => this.playerService.startPlay())
            .catch((err) => console.error(err));
    }

    public ngOnDestroy(): void {
        this.audioService.deactivateMasterSound(); // desactiver le background son quand on quitte la page
    }

    public get car(): Car {
        return this.renderService.car;
    }
}
