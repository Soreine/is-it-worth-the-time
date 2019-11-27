import React from "react";
import plur from "plur";
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
        className="field"
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
  const invalid = props.value === null;
  return (
    <input
      className={"field " + (invalid ? "invalid" : "valid")}
      type="number"
      min="0"
      value={invalid ? "" : (props.value as number)}
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

function pluralizeOptions<T>(
  options: Array<Option<T>>,
  n: number | null
): Array<Option<T>> {
  if (n === null) {
    return options;
  }

  return options.map(o => ({ ...o, label: plur(o.label, n) }));
}

const Line: React.FC = props => {
  return (
    <span className="line">
      {props.children}
      <br />
    </span>
  );
};

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
      <div className="content">
        <h1>I have a recurring task…</h1>
        <div>
          <p>
            <Line>
              {"… that takes "}
              <NumberInput
                value={taskDuration.value.current}
                onChange={taskDuration.value.set}
              />
              <Select
                value={taskDuration.unit.current}
                onChange={taskDuration.unit.set}
                options={pluralizeOptions(
                  TASK_DURATION_UNIT_OPTIONS,
                  taskDuration.value.current
                )}
              />
              {","}
            </Line>
            <Line>
              {"that I have to do "}
              <NumberInput
                value={taskFrequency.value.current}
                onChange={taskFrequency.value.set}
              />
              <b>
                {` ${plur(
                  "time",
                  taskFrequency.value.current === null
                    ? undefined
                    : taskFrequency.value.current
                )} `}
              </b>
              <Select
                value={taskFrequency.unit.current}
                onChange={taskFrequency.unit.set}
                options={TASK_FREQUENCY_UNIT_OPTIONS}
              />
            </Line>
            <Line>
              <b>{" for "}</b>
              <NumberInput
                value={taskLifetime.value.current}
                onChange={taskLifetime.value.set}
              />
              <Select
                value={taskLifetime.unit.current}
                onChange={taskLifetime.unit.set}
                options={pluralizeOptions(
                  TASK_LIFETIME_UNIT_OPTIONS,
                  taskLifetime.value.current
                )}
              />
              {"."}
            </Line>
          </p>
          <p>
            <Line>
              {"If I spent "}
              <NumberInput
                value={timeSpent.value.current}
                onChange={timeSpent.value.set}
              />
              <Select
                value={timeSpent.unit.current}
                onChange={timeSpent.unit.set}
                options={pluralizeOptions(
                  TIME_SPENT_UNIT_OPTIONS,
                  timeSpent.value.current
                )}
              />
            </Line>
            <Line>
              {" I could shorten that task by "}
              <NumberInput
                value={timeShaved.value.current}
                onChange={timeShaved.value.set}
              />
              <Select
                value={timeShaved.unit.current}
                onChange={timeShaved.unit.set}
                options={pluralizeOptions(
                  TIME_SHAVED_UNIT_OPTIONS,
                  timeShaved.value.current
                )}
              />
              {"."}
            </Line>
          </p>
        </div>

        {/* TODO; Add advanced panel to define number of worked hours in a day and worked days in a week ? */}

        <h1>Would it be worth the time?</h1>
        {canComputeResult ? (
          <Results
            taskDuration={normalizeDuration(toUnitValue(taskDuration))}
            timeSpent={normalizeDuration(toUnitValue(timeSpent))}
            timeShaved={normalizeDuration(toUnitValue(timeShaved))}
            taskFrequency={normalizeFrequency(toUnitValue(taskFrequency))}
            taskLifetime={normalizeDuration(toUnitValue(taskLifetime))}
          />
        ) : (
          <EmptyResults />
        )}
      </div>
    </div>
  );
};

const Results: React.FC<{
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
    <div className="results">
      <div className="answer">{worthIt ? "YES!" : "No..."}</div>
      <div className="stats">
        <Stat label="Time spent">{formatDuration(timeSpent)}</Stat>
        <Stat label="Time saved">{formatDuration(timeSaved)}</Stat>
        <Stat label="Efficiency factor">
          {efficiencyFactor === Infinity ? "∞" : efficiencyFactor.toFixed(0)}%
        </Stat>

        <Stat label="Total time of the task">
          {formatDuration(initialTaskTime)}
        </Stat>
        <Stat label="Total time of the task, after optimization">
          {formatDuration(optimizedTaskTime)}
        </Stat>
      </div>
    </div>
  );
};

const EmptyResults: React.FC = () => {
  return (
    <div className="results">
      <div className="answer">-</div>
      <div className="stats">
        <Stat label="Time spent">-</Stat>
        <Stat label="Time saved">-</Stat>
        <Stat label="Efficiency factor">-</Stat>
        <Stat label="Total time of the task">-</Stat>
        <Stat label="Total time of the task, after optimization">-</Stat>
      </div>
    </div>
  );
};

const Stat: React.FC<{ children?: React.ReactNode; label: string }> = ({
  label,
  children
}) => {
  return (
    <div className="stat">
      {label}: <b>{children}</b>
    </div>
  );
};

export default App;
