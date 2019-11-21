import React, { useState } from "react";
import "./App.css";

class Select<T extends string> extends React.Component<{
  value: T;
  onChange: (newValue: T) => void;
  options: Array<{ value: T; label: string }>;
}> {
  render(): React.ReactNode {
    const { onChange, options, value } = this.props;
    return (
      <select
        value={value}
        onChange={event => {
          const newValue = (event.target.value as any) as T;
          onChange(newValue);
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
}

function NumberInput(props: {
  value: number | null;
  onChange: (newValue: number | null) => void;
}) {
  return (
    <input
      type="number"
      min="0"
      value={props.value === null ? "" : props.value}
      onChange={e => {
        if (!e.target.value) {
          return props.onChange(null);
        }

        const value = Math.max(0, parseInt(e.target.value, 10));
        props.onChange(value);
      }}
    />
  );
}

type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

type FrequencyUnit = "daily" | "weekly" | "monthly" | "yearly";

type TimeUnitOption = { value: TimeUnit; label: string };

const SECOND_OPTION: TimeUnitOption = { value: "second", label: "second" };
const MINUTE_OPTION: TimeUnitOption = { value: "minute", label: "minute" };
const HOUR_OPTION: TimeUnitOption = { value: "hour", label: "hour" };
const DAY_OPTION: TimeUnitOption = { value: "day", label: "day" };
const WEEK_OPTION: TimeUnitOption = { value: "week", label: "week" };
const MONTH_OPTION: TimeUnitOption = { value: "month", label: "month" };
const YEAR_OPTION: TimeUnitOption = { value: "year", label: "year" };

const TASK_DURATION_UNIT_OPTIONS = [
  MINUTE_OPTION,
  HOUR_OPTION,
  DAY_OPTION,
  WEEK_OPTION,
  MONTH_OPTION
];

const TIME_SPENT_UNIT_OPTIONS = [
  MINUTE_OPTION,
  HOUR_OPTION,
  DAY_OPTION,
  WEEK_OPTION,
  MONTH_OPTION,
  YEAR_OPTION
];

const TIME_SHAVED_UNIT_OPTIONS = [
  SECOND_OPTION,
  MINUTE_OPTION,
  HOUR_OPTION,
  DAY_OPTION,
  WEEK_OPTION,
  MONTH_OPTION
];

const TASK_LIFETIME_UNIT_OPTIONS = [
  DAY_OPTION,
  WEEK_OPTION,
  MONTH_OPTION,
  YEAR_OPTION
];

const TASK_FREQUENCY_UNIT_OPTIONS: Array<{
  value: FrequencyUnit;
  label: string;
}> = [
  { value: "daily", label: "a day" },
  { value: "weekly", label: "a week" },
  { value: "monthly", label: "a month" },
  { value: "yearly", label: "a year" }
];

type UnitValue<U, V> = {
  value: V;
  unit: U;
};

function useUnitValueState<U, V>(defaultValue: V, defaultUnit: U) {
  const [value, setValue] = React.useState<V | null>(defaultValue);
  const [unit, setUnit] = React.useState<U>(defaultUnit);

  return {
    value: {
      current: value,
      set: setValue
    },
    unit: {
      current: unit,
      set: setUnit
    }
  };
}

function isFilled(unitValueState: { value: { current: any } }) {
  return unitValueState.value.current !== null;
}

function toUnitValue<U, V>(unitValueState: {
  value: {
    current: V | null;
  };
  unit: {
    current: U;
  };
}) {
  if (unitValueState.value.current === null) {
    throw new Error("Cannot work with null values");
  }
  return {
    value: unitValueState.value.current,
    unit: unitValueState.unit.current
  };
}

const App: React.FC = () => {
  const taskDuration = useUnitValueState(3, "minute" as TimeUnit);
  const timeSpent = useUnitValueState(1, "day" as TimeUnit);
  const timeShaved = useUnitValueState(1, "minute" as TimeUnit);
  const taskFrequency = useUnitValueState(5, "daily" as FrequencyUnit);
  const taskLifetime = useUnitValueState(1, "year" as TimeUnit);
  const [daysPerWeek, setDaysPerWeek] = React.useState<number | null>(5);

  const canComputeResult = [
    taskDuration,
    timeShaved,
    timeShaved,
    taskLifetime,
    taskFrequency
  ].every(isFilled);

  return (
    <div className="App">
      <h1>I have a recurring task...</h1>
      <div>
        <p>
          {"that takes "}
          <NumberInput
            value={taskDuration.value.current}
            onChange={taskDuration.value.set}
          />
          <Select
            value={taskDuration.unit.current}
            onChange={taskDuration.unit.set}
            options={TASK_DURATION_UNIT_OPTIONS}
          />
          <br />
          {"that I will do "}
          <NumberInput
            value={taskFrequency.value.current}
            onChange={taskFrequency.value.set}
          />
          {" times "}
          <Select
            value={taskFrequency.unit.current}
            onChange={taskFrequency.unit.set}
            options={TASK_FREQUENCY_UNIT_OPTIONS}
          />
          <br />
          {" for "}
          <NumberInput
            value={taskLifetime.value.current}
            onChange={taskLifetime.value.set}
          />
          <Select
            value={taskLifetime.unit.current}
            onChange={taskLifetime.unit.set}
            options={TASK_LIFETIME_UNIT_OPTIONS}
          />
        </p>
        <p>
          {"If I spent "}
          <NumberInput
            value={timeSpent.value.current}
            onChange={timeSpent.value.set}
          />
          <Select
            value={timeSpent.unit.current}
            onChange={timeSpent.unit.set}
            options={TIME_SPENT_UNIT_OPTIONS}
          />
          <br />
          {" I could shorten that task by "}
          <NumberInput
            value={timeShaved.value.current}
            onChange={timeShaved.value.set}
          />
          <Select
            value={timeShaved.unit.current}
            onChange={timeShaved.unit.set}
            options={TIME_SHAVED_UNIT_OPTIONS}
          />
        </p>
      </div>

      {/* TODO; Add advanced panel to define number of worked hours in a day and worked days in a week ? */}

      {canComputeResult && (
        <Result
          taskDuration={toUnitValue(taskDuration)}
          timeSpent={toUnitValue(timeSpent)}
          timeShaved={toUnitValue(timeShaved)}
          taskFrequency={toUnitValue(taskFrequency)}
          taskLifetime={toUnitValue(taskLifetime)}
        />
      )}
    </div>
  );
};

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

const SECOND: UnitValue<TimeUnit, number> = { value: 1, unit: "second" };
const MINUTE: UnitValue<TimeUnit, number> = { value: 1, unit: "minute" };
const HOUR: UnitValue<TimeUnit, number> = { value: 1, unit: "hour" };
const DAY: UnitValue<TimeUnit, number> = { value: 1, unit: "day" };
const WEEK: UnitValue<TimeUnit, number> = { value: 1, unit: "week" };
const MONTH: UnitValue<TimeUnit, number> = { value: 1, unit: "month" };
const YEAR: UnitValue<TimeUnit, number> = { value: 1, unit: "year" };

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

const Result: React.FC<{
  taskDuration: UnitValue<TimeUnit, number>;
  timeSpent: UnitValue<TimeUnit, number>;
  timeShaved: UnitValue<TimeUnit, number>;
  taskFrequency: UnitValue<FrequencyUnit, number>;
  taskLifetime: UnitValue<TimeUnit, number>;
}> = ({ taskDuration, timeShaved, timeSpent, taskFrequency, taskLifetime }) => {
  // Values normalized to seconds
  const nTimeSpent: number = normalizeDuration(timeSpent);
  const nTimeShaved: number = normalizeDuration(timeShaved);
  const nTaskDuration: number = normalizeDuration(taskDuration);
  const nTaskLifetime: number = normalizeDuration(taskLifetime);
  const nTaskFrequency: number = normalizeFrequency(taskFrequency); // per second

  const initialTaskTime = nTaskDuration * nTaskFrequency * nTaskLifetime;
  const optimizedTaskTime =
    Math.max(0, nTaskDuration - nTimeShaved) * nTaskFrequency * nTaskLifetime;

  const timeSaved = nTimeShaved * nTaskLifetime * nTaskFrequency;
  const worthIt = timeSaved > nTimeSpent;
  const gainRatio =
    nTimeSpent === 0 ? "Infinite" : ((timeSaved / nTimeSpent) * 100).toFixed(0);

  return (
    <div>
      <h1>Would it be worth the time ?</h1>
      <div>{worthIt ? "YES!" : "No..."}</div>
      <div>Time spent: {formatDuration(nTimeSpent)}</div>
      <div>Time saved: {formatDuration(timeSaved)}</div>
      <div>Efficiency factor: {gainRatio}%</div>

      <div>Total time cost of the task: {formatDuration(initialTaskTime)}</div>
      <div>
        Total time cost of the task, after optimization:{" "}
        {formatDuration(optimizedTaskTime)}
      </div>
    </div>
  );
};

export default App;
