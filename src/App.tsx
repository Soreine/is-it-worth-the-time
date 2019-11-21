import React, { useState } from "react";
import "./App.css";

// type Time = number;

// type Task = {
//   duration: Time
// }

// type Frequency = {
//   perDay: number,

// }

// function isItWorthTheTime(task) {}

// function timeSaved(avoidedTask: Task): Time {}

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

function useUnitValue<U, V>(defaultValue: V, defaultUnit: U) {
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

const App: React.FC = () => {
  const timeSpent = useUnitValue(1, DEFAULT_TIME_SPENT_UNIT);
  const timeShaved = useUnitValue(1, DEFAULT_TIME_SHAVED_UNIT);
  const taskLifetime = useUnitValue(2, DEFAULT_TASK_LIFETIME_UNIT);
  const taskFrequency = useUnitValue(10, DEFAULT_TASK_FREQUENCY_UNIT);
  const [daysPerWeek, setDaysPerWeek] = React.useState<number | null>(5);

  const timeSaved = 30;

  return (
    <div className="App">
      <div>
        {"By spending "}
        <NumberInput
          value={timeSpent.value.current}
          onChange={timeSpent.value.set}
        />
        <Select
          value={timeSpent.unit.current}
          onChange={timeSpent.unit.set}
          options={TIME_SPENT_UNIT_OPTIONS}
        />
        {" to shave off "}
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
        {" of a task that I will do for "}
        <NumberInput
          value={taskLifetime.value.current}
          onChange={taskLifetime.value.set}
        />
        <Select
          value={taskLifetime.unit.current}
          onChange={taskLifetime.unit.set}
          options={TASK_LIFETIME_UNIT_OPTIONS}
        />
        {", "}
        <br />
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
        {" and "}
        <NumberInput value={daysPerWeek} onChange={setDaysPerWeek} />
        {" days per week."}
      </div>
      <div>
        <b>Is it worth it?</b>
      </div>
      <div>Yes</div>
      <div>Time saved: {timeSaved}</div>
    </div>
  );
};

export default App;
