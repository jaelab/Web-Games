import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { GameSettingComponent } from "./crossword/game-setting/game-setting.component";
import { MultiplayerComponent } from "./crossword/multiplayer/multiplayer.component";
import { SoloComponent } from "./crossword/solo/solo.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { TrackEditorComponent } from "./racing/track-editor/track-editor.component";
import { GameComponent } from "./racing/game-component/game.component";
import { TrackListComponent } from "./racing/gameSetup/track-list/track-list.component";
import { TrackDetailComponent } from "./racing/gameSetup/track-detail/track-detail.component";
import { MultiplayerLobbyComponent } from "./crossword/multiplayer/multiplayer-lobby/multiplayer-lobby.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "gameSetting", component: GameSettingComponent },
  { path: "crossword/solo/:_difficulty", component: SoloComponent },
  { path: "crossword/multiplayer-lobby", component: MultiplayerLobbyComponent },
  { path: "crossword/multiplayer/:_difficulty/:_roomName/:_playerName", component: MultiplayerComponent },
  { path: "admin", component: AdminComponent },
  { path: "admin/trackeditor/:_trackName", component: TrackEditorComponent },
  { path: "course/:_trackName", component: GameComponent },
  { path: "initialView", component: TrackListComponent },
  { path: "initialView/:name", component: TrackDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
