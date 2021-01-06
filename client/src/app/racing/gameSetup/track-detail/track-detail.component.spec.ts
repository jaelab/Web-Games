import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TrackDetailComponent } from "./track-detail.component";
import { AppModule } from "../../../app.module";

describe("TrackDetailComponent", () => {
  let component: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
/*
describe("trackDetails", () => {
  it("should show the relative informations of the track", () => {
    const track: Track = new Track();
    let allInfosPresent: Boolean = false;

    if (track.name != null &&
        //track.description != null &&
        track.type != null &&
        track.noTimesPlayed != null) {
          allInfosPresent = true;
        }

    expect(allInfosPresent).toEqual(true);
  });
});
*/
