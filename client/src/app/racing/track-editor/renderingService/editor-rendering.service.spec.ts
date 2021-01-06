import { TestBed, inject } from "@angular/core/testing";

import { EditorRenderingService } from "./editor-rendering.service";

describe("EditorRenderingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRenderingService]
    });
  });

  it("should be created", inject([EditorRenderingService], (service: EditorRenderingService) => {
    expect(service).toBeTruthy();
  }));
});
