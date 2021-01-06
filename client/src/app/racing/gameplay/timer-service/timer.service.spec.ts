import { TestBed, inject } from "@angular/core/testing";

import { TimerService } from "./timer.service";
import { Time } from "../time";

describe("TimerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
  });

  it("should be created", inject([TimerService], (service: TimerService) => {
    expect(service).toBeTruthy();
  }));
});

describe("CompareTime", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
  });

  it("should compare 2 instances of Time", inject([TimerService], (service: TimerService) => {
    const time1: Time = new Time();
    time1.minutesDisplay = 1;
    const time2: Time = new Time();
    service.compareTime(time1, time2);
    expect(service.compareTime(time1, time2)).toBe(1);
  }));
});

describe("StartTimer and StopTimer", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
  });

  it("should start and stop timer", inject([TimerService], (service: TimerService) => {
    const time: Time = new Time();
    service.startTimer(time, 0);
    setTimeout(() => {
      service.stopTimer();
      // tslint:disable-next-line:no-magic-numbers
      expect(time.secondsDisplay).toBeGreaterThanOrEqual(5);
    // tslint:disable-next-line:no-magic-numbers
    },         5555);
  }));
});
