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
        props.onChange(0);
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

const TIME_SPENT_UNIT_OPTIONS: Array<TimeUnitOption> = [
  { value: "minute", label: "minutes" },
  { value: "hour", label: "hour" },
  { value: "day", label: "day" },
  { value: "week", label: "week" },
  { value: "month", label: "month" },
  { value: "year", label: "year" }
];
const DEFAULT_TIME_SPENT_UNIT = TIME_SPENT_UNIT_OPTIONS[1].value;

const TIME_SHAVED_UNIT_OPTIONS: Array<TimeUnitOption> = [
  { value: "second", label: "second" },
  { value: "minute", label: "minute" },
  { value: "hour", label: "hour" },
  { value: "day", label: "day" },
  { value: "week", label: "week" },
  { value: "month", label: "month" }
];
const DEFAULT_TIME_SHAVED_UNIT = TIME_SHAVED_UNIT_OPTIONS[1].value;

const TASK_LIFETIME_UNIT_OPTIONS: Array<TimeUnitOption> = [
  { value: "day", label: "day" },
  { value: "week", label: "week" },
  { value: "month", label: "month" },
  { value: "year", label: "year" }
];
const DEFAULT_TASK_LIFETIME_UNIT = TASK_LIFETIME_UNIT_OPTIONS[1].value;

const TASK_FREQUENCY_UNIT_OPTIONS: Array<{
  value: FrequencyUnit;
  label: string;
}> = [
  { value: "daily", label: "a day" },
  { value: "weekly", label: "a week" },
  { value: "monthly", label: "a month" },
  { value: "yearly", label: "a year" }
];
const DEFAULT_TASK_FREQUENCY_UNIT = TASK_FREQUENCY_UNIT_OPTIONS[0].value;

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
  const timeSpent = useUnitValueState(1, DEFAULT_TIME_SPENT_UNIT);
  const timeShaved = useUnitValueState(1, DEFAULT_TIME_SHAVED_UNIT);
  const taskLifetime = useUnitValueState(2, DEFAULT_TASK_LIFETIME_UNIT);
  const taskFrequency = useUnitValueState(10, DEFAULT_TASK_FREQUENCY_UNIT);
  const [daysPerWeek, setDaysPerWeek] = React.useState<number | null>(5);

  const canComputeResult = [
    timeShaved,
    timeShaved,
    taskLifetime,
    taskFrequency
  ].every(isFilled);

  return (
    <div className="App">
      <div>
        {"If I spend "}
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
        {" I can shave off "}
        <NumberInput
          value={timeShaved.value.current}
          onChange={timeShaved.value.set}
        />
        <Select
          value={timeShaved.unit.current}
          onChange={timeShaved.unit.set}
          options={TIME_SHAVED_UNIT_OPTIONS}
        />
        <br />
        {" of a task that I will do "}
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
      </div>

      {/* TODO; Add advanced panel to define number of worked hours in a day and worked days in a week ? */}

      {canComputeResult && (
        <Result
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
  timeSpent: UnitValue<TimeUnit, number>;
  timeShaved: UnitValue<TimeUnit, number>;
  taskFrequency: UnitValue<FrequencyUnit, number>;
  taskLifetime: UnitValue<TimeUnit, number>;
}> = () => {
  // Values normalized for seconds
  const nTimeSpent: number = 0; // seconds
  const nTimeShaved: number = 0; // seconds
  const nTaskFrequency: number = 0; // per second
  const nTaskLifetime: number = 0; // seconds

  const dailyTime = 0;
  const initialTaskTime = 0;
  const optimizedTaskTime = 0;
  const gainRatio = 0;
  const timeSaved = 30;
  const worthIt = timeSaved > nTimeSpent;

  return (
    <div>
      <div>
        <b>Is it worth it?</b>
      </div>
      <div>{worthIt ? "Yes" : "No"}</div>
      <div>Average time for the task per day: {dailyTime}</div>
      <div>Total time for the future task: {initialTaskTime}</div>
      <div>
        Total time for the future task, after optimization: {optimizedTaskTime}
      </div>
      <div>Time saved: {timeSaved}</div>
      <div>Time gain ratio: {gainRatio}</div>
    </div>
  );
};

export default App;
