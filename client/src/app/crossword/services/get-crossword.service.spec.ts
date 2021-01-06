import { TestBed, inject } from "@angular/core/testing";
import { AppModule } from "../../app.module";
import { GetCrosswordService } from "./get-crossword.service";

describe("GetCrosswordService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ]
        });
    });

    it("should be created", inject([GetCrosswordService], (service: GetCrosswordService) => {
        expect(service).toBeTruthy();
    }));
});
