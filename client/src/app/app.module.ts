import { FocusDirective } from "./crossword/components/cell/focus.directive";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule} from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppRoutingModule } from ".//app-routing.module";

import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { HomeComponent } from "./home/home.component";
import { GameSettingComponent } from "./crossword/game-setting/game-setting.component";
import { MultiplayerComponent } from "./crossword/multiplayer/multiplayer.component";
import { SoloComponent } from "./crossword/solo/solo.component";
import { TrackEditorComponent } from "./racing/track-editor/track-editor.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { CheatModeComponent } from "./crossword/components/cheat-mode/cheat-mode.component";
import { CellComponent } from "./crossword/components/cell/cell.component";
import { DefinitionComponent } from "./crossword/components/definition/definition.component";

import { RenderService } from "./racing/render-service/render.service";
import { GetCrosswordService } from "./crossword/services/get-crossword.service";
import { EditorRenderingService } from "./racing/track-editor/renderingService/editor-rendering.service";
import { TrackValidatorService } from "./racing/track/trackValidatorService/track-validator.service";
import { CamerasService } from "./racing/render-service/cameras.service";
import {CarHandlerService} from "./racing/car/car-handler.service";
import { TrackListComponent } from "./racing/gameSetup/track-list/track-list.component";
import { TrackDetailComponent } from "./racing/gameSetup/track-detail/track-detail.component";

import { CellHiglighterService } from "./crossword/services/cellComponentServices/cell-higlighter.service";
import { CellFocuserService } from "./crossword/services/cellComponentServices/cell-focuser.service";
import { WordFinderService } from "./crossword/services/word-finder.service";
import { CheatModeService } from "./crossword/components/cheat-mode/cheat-mode.service";
import { LetterPlacerService } from "./crossword/services/cellComponentServices/letter-placer.service";
import { CellComponentService } from "./crossword/services/cellComponentServices/cell-component.service";
import { CellValidatorService } from "./crossword/services/cellComponentServices/cell-validator.service";
import { DefinitionComponentService } from "./crossword/services/definitionComponentServices/definition-component.service";
import { DefinitionDisableService } from "./crossword/services/definitionComponentServices/definition-disable.service";
import { GameMechanicsService } from "./crossword/services/game-mechanics.service";
import { ProgressBarComponent } from "./crossword/components/progress-bar/progress-bar.component";
import { GameInformationsComponent } from "./crossword/components/game-informations/game-informations.component";

import { HttpTracksService } from "./racing/httpTrackService/http-tracks.service";
import { TrackOverviewComponent } from "./racing/gameSetup/track-detail/track-overview/track-overview.component";
import { Track3dService } from "./racing/track/track3d.service";
import { EventHandlerService } from "./racing/eventHandler-service/event-handler.service";
import { MultiplayerLobbyComponent } from "./crossword/multiplayer/multiplayer-lobby/multiplayer-lobby.component";
import { SocketService } from "./crossword/services/socket.service";
import { PlayerService } from "./racing/gameplay/player-service/player.service";
import { TimerService } from "./racing/gameplay/timer-service/timer.service";
import { CountdownService } from "./racing/gameplay/countdown-service/countdown.service";
import { AudioService } from "./racing/audio.service";
import { Wall3dService } from "./racing/track/wall3d.service";
import { Wall3dLogicService } from "./racing/track/wall3d-logic.service";
import { StartingPositionCarService } from "./racing/render-service/starting-position-car.service";
import { Track3dLogicService } from "./racing/track/track3d-logic.service";
import { LapCountingService } from "./racing/gameplay/lapCounting-service/lap-counting.service";
import { CarCollisionService } from "./racing/car/car-collision.service";
import { DetectorService } from "./racing/car/detector.service";
import { AiControlerService } from "./racing/car/ai-controler.service";
import { DetectorIntersectionService } from "./racing/car/detector-intersection.service";
import { RaceResultsComponent } from "./racing/end-game/race-results/race-results.component";
import { BestTimeComponent } from "./racing/end-game/best-time/best-time.component";
import { SortTableService } from "./racing/end-game/race-results/sortTable-service/sort-table.service";
import { SimulateResultService } from "./racing/gameplay/simulateResults-service/simulate-result.service";
import { DayNightService } from "./racing/render-service/day-night.service";
import { APP_BASE_HREF } from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        TrackEditorComponent,
        HomeComponent,
        GameSettingComponent,
        MultiplayerComponent,
        SoloComponent,
        AdminComponent,
        CheatModeComponent,
        TrackListComponent,
        TrackDetailComponent,
        CellComponent,
        FocusDirective,
        DefinitionComponent,
        ProgressBarComponent,
        GameInformationsComponent,
        TrackOverviewComponent,
        MultiplayerLobbyComponent,
        RaceResultsComponent,
        BestTimeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        MatExpansionModule,
        MatButtonModule
    ],

    providers: [
        RenderService,
        EditorRenderingService,
        GetCrosswordService,
        TrackValidatorService,
        CheatModeService,
        CamerasService,
        CarHandlerService,
        CellHiglighterService,
        CellFocuserService,
        WordFinderService,
        LetterPlacerService,
        CellComponentService,
        CellValidatorService,
        DefinitionComponentService,
        DefinitionDisableService,
        GameMechanicsService,
        HttpTracksService,
        Track3dService,
        EventHandlerService,
        SocketService,
        PlayerService,
        TimerService,
        CountdownService,
        AudioService,
        Wall3dService,
        Wall3dLogicService,
        StartingPositionCarService,
        Track3dLogicService,
        LapCountingService,
        CarCollisionService,
        DetectorService,
        SortTableService,
        AiControlerService,
        DetectorIntersectionService,
        SimulateResultService,
        DayNightService,
        {provide: APP_BASE_HREF, useValue: "/"}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
