import { TestBed, inject } from "@angular/core/testing";

import { SortTableService } from "./sort-table.service";
import { TimerService } from "../../../gameplay/timer-service/timer.service";
import { Player } from "../../../gameplay/player";
import { Time } from "../../../gameplay/time";

describe("SortTableService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortTableService, TimerService]
    });
  });

  it("should be created", inject([SortTableService], (service: SortTableService) => {
    expect(service).toBeTruthy();
  }));
});

describe("Sort Table Service", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortTableService, TimerService]
    });
  });
  it("should sort an array in ascendant order", inject([SortTableService], (service: SortTableService) => {
    const players: Array<Player> = new Array();
    for (let i: number = 3; i > 0; i--) {
      const player: Player = new Player("player" + i);
      const time: Time = new Time();
      time.minutesDisplay = i;
      player.totalTime.set(time);
      players.push(player);
    }
    let arrayInOrder: boolean = false;
    service.sortDataAsc(players);
    if (players[0].name === "player1" &&
        players[1].name === "player2" &&
        // tslint:disable-next-line:no-magic-numbers      2 est permis
        players[2].name === "player3") {
          arrayInOrder = true;
    }
    expect(arrayInOrder).toEqual(true);
  }));
});
