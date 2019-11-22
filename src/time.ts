export type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

export type FrequencyUnit = "daily" | "weekly" | "monthly" | "yearly";
export type TimeUnitOption = { value: TimeUnit; label: string };

export type UnitValue<U, V> = {
  value: V;
  unit: U;
};

const SECOND: UnitValue<TimeUnit, number> = { value: 1, unit: "second" };
const MINUTE: UnitValue<TimeUnit, number> = { value: 1, unit: "minute" };
const HOUR: UnitValue<TimeUnit, number> = { value: 1, unit: "hour" };
const DAY: UnitValue<TimeUnit, number> = { value: 1, unit: "day" };
const WEEK: UnitValue<TimeUnit, number> = { value: 1, unit: "week" };
const MONTH: UnitValue<TimeUnit, number> = { value: 1, unit: "month" };
const YEAR: UnitValue<TimeUnit, number> = { value: 1, unit: "year" };

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 7; // worked hours per day
const DAYS_IN_WEEK = 5; // worked days per week
const DAYS_IN_MONTH = 21; // worked days per month
const MONTHS_IN_YEAR = 12;

function normalizeDuration({
  value,
  unit
}: UnitValue<TimeUnit, number>): number {
  switch (unit) {
    case "second":
      return value;
    case "minute":
      return normalizeDuration({
        value: value * SECONDS_IN_MINUTE,
        unit: "second"
      });
    case "hour":
      return normalizeDuration({
        value: value * MINUTES_IN_HOUR,
        unit: "minute"
      });
    case "day":
      return normalizeDuration({ value: value * HOURS_IN_DAY, unit: "hour" });
    case "week":
      return normalizeDuration({ value: value * DAYS_IN_WEEK, unit: "day" });
    case "month":
      return normalizeDuration({ value: value * DAYS_IN_MONTH, unit: "day" });
    case "year":
      return normalizeDuration({
        value: value * MONTHS_IN_YEAR,
        unit: "month"
      });
  }
}

function normalizeFrequency({
  value,
  unit
}: UnitValue<FrequencyUnit, number>): number {
  switch (unit) {
    case "daily":
      return value / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY);
    case "weekly":
      return normalizeFrequency({ value: value / DAYS_IN_WEEK, unit: "daily" });
    case "monthly":
      return normalizeFrequency({
        value: value / DAYS_IN_MONTH,
        unit: "daily"
      });
    case "yearly":
      return normalizeFrequency({
        value: value / MONTHS_IN_YEAR,
        unit: "monthly"
      });
  }
}

function decomposeDuration(
  duration: number, // seconds
  precision: number // percentage of precision, for simpler decomposition
): Array<UnitValue<TimeUnit, number>> {
  if (precision >= 1) {
    // 0 is a good approximation at +/- 100%
    return [];
  }

  const highestMagnitude = [YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND].find(
    magnitude => duration >= normalizeDuration(magnitude)
  );

  if (!highestMagnitude) {
    // Less than one second
    return [];
  }

  const magnitudeDuration = normalizeDuration(highestMagnitude);
  const magnitudeNumber = Math.floor(duration / magnitudeDuration);
  const restDuration = duration - magnitudeNumber * magnitudeDuration;

  let rest: Array<UnitValue<TimeUnit, number>>;
  if (restDuration <= 0) {
    // Nothing left to decompose
    rest = [];
  } else {
    const restPrecision = (precision * duration) / restDuration;
    rest = decomposeDuration(restDuration, restPrecision);
  }

  return [{ ...highestMagnitude, value: magnitudeNumber }, ...rest];
}
/**
 * Return a human readable string to represent a duration, using given precision
 */
function formatDuration(
  duration: number, // seconds
  precision: number = 0.05 // percentage, for simpler representation. Default 5%
) {
  const decomposition = decomposeDuration(duration, precision);
  // Format the decomposition as a string
  return decomposition.map(({ value, unit }) => `${value} ${unit}`).join(", ");
}

function isItWorthIt(
  taskDuration: number, // seconds
  taskFrequency: number, // per second
  taskLifetime: number, // seconds
  timeShaved: number, // seconds
  timeSpent: number // seconds
) {
  const initialTaskTime = taskDuration * taskFrequency * taskLifetime;
  const optimizedTaskTime =
    Math.max(0, taskDuration - timeShaved) * taskFrequency * taskLifetime;

  const timeSaved = timeShaved * taskLifetime * taskFrequency;
  const worthIt = timeSaved > timeSpent;
  const gainRatio = timeSpent === 0 ? Infinity : (timeSaved / timeSpent) * 100;

  return {
    worthIt,
    timeSaved,
    initialTaskTime,
    optimizedTaskTime,
    gainRatio
  };
}

export { isItWorthIt, formatDuration, normalizeDuration, normalizeFrequency };
