import { TestBed, inject } from "@angular/core/testing";

import { StartingPositionCarService } from "./starting-position-car.service";
import { Track3dService } from "../track/track3d.service";
import { Matrix4 } from "three";
import { HttpTracksService } from "../httpTrackService/http-tracks.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Track3dLogicService } from "../track/track3d-logic.service";
import { Wall3dService } from "../track/wall3d.service";
import { Wall3dLogicService } from "../track/wall3d-logic.service";

describe("StartingPositionCarService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StartingPositionCarService, Track3dService, HttpTracksService, HttpClient,
                  HttpHandler, Track3dLogicService, Wall3dService, Wall3dLogicService]
    });
  });

  it("should be created", inject([StartingPositionCarService], (service: StartingPositionCarService) => {
    expect(service).toBeTruthy();
  }));

  describe("function placeCarStartingPosition", () => {
    it("should place 4 car positions in random order",
       inject([StartingPositionCarService, Track3dService], async (service: StartingPositionCarService, track: Track3dService) => {
      await track.init();
      const positions: Matrix4[] = service.placeCarStartingPosition(track.children);
      const positions2: Matrix4[] = service.placeCarStartingPosition(track.children);
      expect(positions[0]).not.toEqual(positions2[0]);
    }));
  });
});
