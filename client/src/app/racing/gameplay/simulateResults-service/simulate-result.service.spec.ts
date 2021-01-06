// tslint:disable:no-magic-numbers
import { TestBed, inject } from "@angular/core/testing";

import { SimulateResultService } from "./simulate-result.service";
import { Track } from "../../track/track";
import { Vector3 } from "three";
import { Player } from "../player";
import { AiCar } from "../../car/aiCar";

describe("SimulateResultService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulateResultService]
    });
  });

  it("should be created", inject([SimulateResultService], (service: SimulateResultService) => {
    expect(service).toBeTruthy();
  }));
});

describe("Function SimulateResults", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulateResultService]
    });
  });

  it("should simulate results of AI players who doesnt finished game", inject([SimulateResultService], (service: SimulateResultService) => {
    const track: Track = new Track();
    track.addNextSegmentToTrackData(new Vector3(0, 0, 0), new Vector3(10, 10, 0));
    track.addNextSegmentToTrackData(new Vector3(10, 10, 0), new Vector3(0, 20, 0));

    const players: Player[] = new Array();

    const playerHuman: Player = new Player("Human Player");
    players.push(playerHuman);

    const playerAi: Player = new Player("AI");
    playerAi.completedLap = 3;
    const aiCar: AiCar = new AiCar();
    playerAi.car = aiCar;
    players.push(playerAi);

    // expect().toBeTruthy();
  }));
});
