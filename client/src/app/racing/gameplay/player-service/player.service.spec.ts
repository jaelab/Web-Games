import { TestBed, inject } from "@angular/core/testing";

import { PlayerService } from "./player.service";
import { AppModule } from "../../../app.module";

describe("PlayerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([PlayerService], (service: PlayerService) => {
    expect(service).toBeTruthy();
  }));
});
