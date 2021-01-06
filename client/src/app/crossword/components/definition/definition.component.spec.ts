import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DefinitionComponent } from "./definition.component";
import { CheatModeService } from "../cheat-mode/cheat-mode.service";
import { Word } from "../../../../../../common/communication/word";

describe("DefinitionComponent", () => {
  let component: DefinitionComponent;
  let fixture: ComponentFixture<DefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinitionComponent ], providers: [CheatModeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionComponent);
    component = fixture.componentInstance;
    const wordFound: boolean = false;
    component.definition = [new Word(), "test"];
    component.wordFound = wordFound;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Function definitionClicked", () => {

    it("should return the clicked definition word", () => {
      const mockWord: Word = new Word(0, 0, true, "hello");
      component.definition = [mockWord, "test"];
      component.definitionClicked(new MouseEvent("click"));

      component.definitionClickedEvent.subscribe((word: Word) => {
        expect(word).toEqual(mockWord);
      });
    });

  });
});
