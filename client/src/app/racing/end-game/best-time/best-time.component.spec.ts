import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BestTimeComponent } from "./best-time.component";
import { AppModule } from "../../../app.module";
import { Track } from "../../track/track";
import { Player } from "../../gameplay/player";

describe("BestTimeComponent", () => {
  let component: BestTimeComponent;
  let fixture: ComponentFixture<BestTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestTimeComponent);
    component = fixture.componentInstance;

    const track: Track = new Track();
    component.track = track;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Function meritLeaveName()", () => {

    it("should return true if player finished in first place and ranks among best times", () => {
      const player: Player = new Player("Human Player");
      player.lapTime.minutesDisplay = 1;
      const players: Array<Player> = new Array();
      players.push(player);
      component.players = players;
      expect(component.meritLeaveName()).toBeTruthy();
    });
  });
});
