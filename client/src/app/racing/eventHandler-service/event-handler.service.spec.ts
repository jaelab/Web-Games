import { TestBed, inject } from "@angular/core/testing";
import { EventHandlerService } from "./event-handler.service";
import { AppModule } from "../../app.module";

describe("EventHandlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([EventHandlerService], (service: EventHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
