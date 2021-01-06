import { TestBed, inject } from "@angular/core/testing";

import { CheatModeService } from "./cheat-mode.service";

describe("CheatModeService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheatModeService]
    });
  });

  it("should be created", inject([CheatModeService], (service: CheatModeService) => {
    expect(service).toBeTruthy();
  }));

  describe("Function changeMode", () => {

    it("should change the game mode", inject([CheatModeService], (service: CheatModeService) => {
      const isCheatMode: boolean = service._isCheatMode;
      const mode: string = service._mode;
      service.changeMode();
      expect(service._isCheatMode).toEqual(!isCheatMode);
      expect(service._mode).not.toEqual(mode);
    }));

  });

});
