import React from "react";
import Select from "react-select";
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

type TimeSpentUnit = "minute" | "hour" | "day" | "week" | "month" | "year";

// function Select<T extends string>(props: {
//   onChange: (newValue: T) => void;
//   values: Array<[T, string]>;
// }): React.ReactNode {
//   return (
//     <select
//       onChange={event => {
//         const newValue = (event.target.value as any) as T;
//         props.onChange(newValue);
//       }}
//     >
//       {props.values.map(([value, text]) => (
//         <option value={value}>{text}</option>
//       ))}
//     </select>
//   );
// }

function NumberInput(props: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  return (
    <input
      value={props.value}
      onChange={e => props.onChange(parseInt(e.target.value))}
    />
  );
}

type TimeSpentUnitOption = { value: TimeSpentUnit; label: string };
const TIME_SPENT_OPTIONS: TimeSpentUnitOption[] = [
  { value: "minute", label: "minutes" },
  { value: "hour", label: "hour" },
  { value: "day", label: "day" },
  { value: "week", label: "week" },
  { value: "month", label: "month" },
  { value: "year", label: "year" }
];
const DEFAULT_TIME_SPENT_OPTION = TIME_SPENT_OPTIONS[1];

const App: React.FC = () => {
  const [timeSpentValue, setTimeSpentValue] = React.useState<number>(1);
  const [timeSpentUnitOption, setTimeSpentUnitOption] = React.useState<
    TimeSpentUnitOption
  >(DEFAULT_TIME_SPENT_OPTION);

  const timeSaved = 30;

  return (
    <div className="App">
      <div>
        {"If I spend "}
        <NumberInput value={timeSpentValue} onChange={setTimeSpentValue} />
        <Select
          value={timeSpentUnitOption}
          onChange={(
            selected?: TimeSpentUnitOption | TimeSpentUnitOption[] | void
          ) => {
            return;
          }}
          options={[
            { value: "minute", label: "minutes" },
            { value: "hour", label: "hour" },
            { value: "day", label: "day" },
            { value: "week", label: "week" },
            { value: "month", label: "month" },
            { value: "year", label: "year" }
          ]}
        />
        <select onChange={setTimeSpentUnit}></select>
        {" to shave off "}
        <input value={1} />
        <select>
          <option value="second">second</option>
          <option value="minute" selected>
            minute
          </option>
          <option value="hour">hour</option>
        </select>
        <br />
        {" of a task that I will do for "}
        <input placeholder="How long will you do the task" value={2} />
        <select>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
          <option value="year" selected>
            year
          </option>
        </select>
        {", "} <br />
        <input placeholder="How often you do the task" value={10} />
        {" times "}
        <select>
          <option value="daily" selected>
            a day
          </option>
          <option value="weekly">a week</option>
          <option value="monthly">a month</option>
          <option value="yearly">a year</option>
        </select>
        <br />
        {" and "}
        <input placeholder="How many days in a week" value={5} />
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
