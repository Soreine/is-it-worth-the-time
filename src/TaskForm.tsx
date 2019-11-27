import React from "react";
import plur from "plur";
import "./App.css";

import { UnitValueState, Option } from "./App";
import { FrequencyUnit, TimeUnit } from "./time";

import Select from "./Select";
import NumberInput from "./NumberInput";

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

const TaskForm: React.FC<{
  taskDuration: UnitValueState<TimeUnit, number>;
  timeShaved: UnitValueState<TimeUnit, number>;
  timeSpent: UnitValueState<TimeUnit, number>;
  taskLifetime: UnitValueState<TimeUnit, number>;
  taskFrequency: UnitValueState<FrequencyUnit, number>;
}> = ({ taskDuration, timeShaved, timeSpent, taskLifetime, taskFrequency }) => {
  return (
    <>
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
    </>
  );
};

export default TaskForm;
