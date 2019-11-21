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

function normalizeTime({ value, unit }: UnitValue<TimeUnit, number>): number {
  switch (unit) {
    case "second":
      return value;
    case "minute":
      return normalizeTime({ value: value * 60, unit: "second" });
    case "hour":
      return normalizeTime({ value: value * 60, unit: "minute" });
    case "day":
      // 7 work hours in a day
      return normalizeTime({ value: value * 7, unit: "hour" });
    case "week":
      // 5 work days in a week
      return normalizeTime({ value: value * 5, unit: "day" });
    case "month":
      // 21 work days in a month on average
      return normalizeTime({ value: value * 21, unit: "day" });
    case "year":
      return normalizeTime({ value: value * 12, unit: "month" });
  }
}

function normalizeFrequency({
  value,
  unit
}: UnitValue<FrequencyUnit, number>): number {
  switch (unit) {
    case "daily":
      // 7 work hours in a day
      return value / (7 * 60 * 60);
    case "weekly":
      // 5 work days in a week
      return normalizeFrequency({ value: value / 5, unit: "daily" });
    case "monthly":
      // 21 work days in a month on average
      return normalizeFrequency({ value: value / 21, unit: "daily" });
    case "yearly":
      return normalizeFrequency({ value: value / 12, unit: "monthly" });
  }
}

const Result: React.FC<{
  taskDuration: UnitValue<TimeUnit, number>;
  timeSpent: UnitValue<TimeUnit, number>;
  timeShaved: UnitValue<TimeUnit, number>;
  taskFrequency: UnitValue<FrequencyUnit, number>;
  taskLifetime: UnitValue<TimeUnit, number>;
}> = ({ taskDuration, timeShaved, timeSpent, taskFrequency, taskLifetime }) => {
  // Values normalized to seconds
  const nTimeSpent: number = normalizeTime(timeSpent);
  const nTimeShaved: number = normalizeTime(timeShaved);
  const nTaskDuration: number = normalizeTime(taskDuration);
  const nTaskLifetime: number = normalizeTime(taskLifetime);
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
      <div>{worthIt ? "YES!" : "Nope..."}</div>
      <div>Time spent: {nTimeSpent} seconds</div>
      <div>Time saved: {timeSaved} seconds</div>
      <div>Efficiency factor: {gainRatio}%</div>

      <div>Total time cost of the task: {initialTaskTime}</div>
      <div>
        Total time cost of the task, after optimization: {optimizedTaskTime}
      </div>
    </div>
  );
};

export default App;
