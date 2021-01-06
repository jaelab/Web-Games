import { TestBed, inject } from "@angular/core/testing";

import { GameMechanicsService } from "./game-mechanics.service";
import { AppModule } from "../../app.module";

describe("GameMechanicsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([GameMechanicsService], (service: GameMechanicsService) => {
    expect(service).toBeTruthy();
  }));
});
