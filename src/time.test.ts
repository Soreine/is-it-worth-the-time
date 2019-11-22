import {
  TimeUnit,
  normalizeDuration,
  decomposeDuration,
  HOURS_IN_DAY,
  DAYS_IN_WEEK,
  DAYS_IN_MONTH,
  MONTHS_IN_YEAR,
  isItWorthIt,
  normalizeFrequency
} from "./time";

const norm = normalizeDuration;

const [second, minute, hour, day, week, month, year] = ([
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year"
] as TimeUnit[]).map(unit => (n: number) => ({
  value: n,
  unit
}));

describe("normalizeDuration", () => {
  it("normalize seconds", () => {
    expect(normalizeDuration(second(3))).toBe(3);
    expect(normalizeDuration(second(3213))).toBe(3213);
  });
  it("normalize minutes", () => {
    expect(normalizeDuration(minute(1))).toBe(60);
    expect(normalizeDuration(minute(100))).toBe(6000);
  });
  it("normalize hour", () => {
    expect(normalizeDuration(hour(1))).toBe(60 * 60);
    expect(normalizeDuration(hour(100))).toBe(60 * 60 * 100);
  });
  it("normalize day", () => {
    expect(normalizeDuration(day(1))).toBe(60 * 60 * HOURS_IN_DAY);
    expect(normalizeDuration(day(100))).toBe(60 * 60 * HOURS_IN_DAY * 100);
  });
  it("normalize week", () => {
    expect(normalizeDuration(week(1))).toBe(
      60 * 60 * HOURS_IN_DAY * DAYS_IN_WEEK
    );
    expect(normalizeDuration(week(100))).toBe(
      100 * 60 * 60 * HOURS_IN_DAY * DAYS_IN_WEEK
    );
  });
  it("normalize month", () => {
    expect(normalizeDuration(month(1))).toBe(
      60 * 60 * HOURS_IN_DAY * DAYS_IN_MONTH
    );
    expect(normalizeDuration(month(100))).toBe(
      100 * 60 * 60 * HOURS_IN_DAY * DAYS_IN_MONTH
    );
  });
  it("normalize year", () => {
    expect(normalizeDuration(year(1))).toBe(
      60 * 60 * HOURS_IN_DAY * DAYS_IN_MONTH * MONTHS_IN_YEAR
    );
    expect(normalizeDuration(year(100))).toBe(
      100 * 60 * 60 * HOURS_IN_DAY * DAYS_IN_MONTH * MONTHS_IN_YEAR
    );
  });
});

describe("decomposeDuration", () => {
  it("should decompose 1,1,1,1,1,1", () => {
    const sum = [
      second(1),
      minute(1),
      hour(1),
      day(1),
      week(1),
      month(1),
      year(1)
    ]
      .map(normalizeDuration)
      .reduce((a, x) => a + x, 0);

    expect(decomposeDuration(sum, 0)).toMatchObject(
      [
        second(1),
        minute(1),
        hour(1),
        day(1),
        week(1),
        month(1),
        year(1)
      ].reverse()
    );
  });

  it("should decompose 11 month, 1 week, 1 hour", () => {
    const duration = [
      //   second(1),
      //   minute(1),
      hour(1),
      //   day(1),
      week(1),
      month(11)
      //   year(1)
    ]
      .map(normalizeDuration)
      .reduce((a, x) => a + x, 0);

    expect(decomposeDuration(duration, 0.01)).toMatchObject(
      [week(1), month(11)].reverse()
    );
  });
});

describe("isItWorthIt", () => {
  it("should work with default example", () => {
    const taskDuration = norm(minute(3));
    const taskFrequency = normalizeFrequency({ value: 5, unit: "daily" });
    const taskLifetime = norm(year(1));
    const timeShaved = norm(minute(1));
    const timeSpent = norm(day(1));

    const initialTaskTime = taskDuration * taskLifetime * taskFrequency;
    const optimizedTaskTime =
      (taskDuration - timeShaved) * taskLifetime * taskFrequency;
    const timeSaved = initialTaskTime - optimizedTaskTime;
    const gainRatio = (timeSaved / timeSpent) * 100;

    const worthIt = true;

    expect(
      isItWorthIt(
        taskDuration,
        taskFrequency,
        taskLifetime,
        timeShaved,
        timeSpent
      )
    ).toMatchObject({
      worthIt,
      timeSaved,
      initialTaskTime,
      optimizedTaskTime,
      gainRatio
    });
  });

  it("should work with reducing task to 0", () => {
    const taskDuration = norm(minute(3));
    const taskFrequency = normalizeFrequency({ value: 5, unit: "daily" });
    const taskLifetime = norm(year(1));
    const timeShaved = norm(minute(3));
    const timeSpent = norm(day(1));

    expect(
      isItWorthIt(
        taskDuration,
        taskFrequency,
        taskLifetime,
        timeShaved,
        timeSpent
      )
    ).toMatchObject({
      worthIt: true,
      timeSaved: 226800,
      initialTaskTime: 226800,
      optimizedTaskTime: 0,
      gainRatio: 900
    });
  });
});
