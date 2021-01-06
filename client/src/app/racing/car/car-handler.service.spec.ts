import { TestBed, inject } from "@angular/core/testing";

import { CarHandlerService } from "./car-handler.service";
import { AudioService } from "../audio.service";

describe("CarHandlerServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarHandlerService, AudioService]
    });
  });

  it("should be created", inject([CarHandlerService], (service: CarHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
