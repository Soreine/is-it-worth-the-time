import React from "react";
import "./App.css";

import {
  FrequencyUnit,
  TimeUnit,
  UnitValue,
  normalizeDuration,
  normalizeFrequency,
  formatDuration,
  isItWorthIt
} from "./time";

type Option<T> = { value: T; label: string };

class Select<T extends string> extends React.Component<{
  value: T;
  onChange: (newValue: T) => void;
  options: Array<Option<T>>;
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

const SECOND_OPTION: Option<TimeUnit> = { value: "second", label: "second" };
const MINUTE_OPTION: Option<TimeUnit> = { value: "minute", label: "minute" };
const HOUR_OPTION: Option<TimeUnit> = { value: "hour", label: "hour" };
const DAY_OPTION: Option<TimeUnit> = { value: "day", label: "day" };
const WEEK_OPTION: Option<TimeUnit> = { value: "week", label: "week" };
const MONTH_OPTION: Option<TimeUnit> = { value: "month", label: "month" };
const YEAR_OPTION: Option<TimeUnit> = { value: "year", label: "year" };

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
}): UnitValue<U, V> {
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
  const timeSpent = useUnitValueState(1, "hour" as TimeUnit);
  const timeShaved = useUnitValueState(2, "minute" as TimeUnit);
  const taskFrequency = useUnitValueState(10, "daily" as FrequencyUnit);
  const taskLifetime = useUnitValueState(1, "month" as TimeUnit);

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
          taskDuration={normalizeDuration(toUnitValue(taskDuration))}
          timeSpent={normalizeDuration(toUnitValue(timeSpent))}
          timeShaved={normalizeDuration(toUnitValue(timeShaved))}
          taskFrequency={normalizeFrequency(toUnitValue(taskFrequency))}
          taskLifetime={normalizeDuration(toUnitValue(taskLifetime))}
        />
      )}
    </div>
  );
};

const Result: React.FC<{
  taskDuration: number;
  timeSpent: number;
  timeShaved: number;
  taskFrequency: number;
  taskLifetime: number;
}> = ({ taskDuration, timeShaved, timeSpent, taskFrequency, taskLifetime }) => {
  const {
    worthIt,
    timeSaved,
    initialTaskTime,
    optimizedTaskTime,
    efficiencyFactor
  } = isItWorthIt(
    taskDuration,
    taskFrequency,
    taskLifetime,
    timeShaved,
    timeSpent
  );

  return (
    <div>
      <h1>Would it be worth the time ?</h1>
      <div>{worthIt ? "YES!" : "No..."}</div>
      <div>Time spent: {formatDuration(timeSpent)}</div>
      <div>Time saved: {formatDuration(timeSaved)}</div>
      <div>
        Efficiency factor:{" "}
        {efficiencyFactor === Infinity ? "∞" : efficiencyFactor.toFixed(0)}%
      </div>

      <div>Total time of the task: {formatDuration(initialTaskTime)}</div>
      <div>
        Total time of the task, after optimization:{" "}
        {formatDuration(optimizedTaskTime)}
      </div>
    </div>
  );
};

export default App;
