import React from "react";
import "./App.css";

import {
  FrequencyUnit,
  TimeUnit,
  UnitValue,
  normalizeDuration,
  normalizeFrequency
} from "./time";

import { Results, EmptyResults } from "./Results";
import TaskForm from "./TaskForm";

export type Option<T> = { value: T; label: string };

export type UnitValueState<U, V> = {
  value: {
    current: V | null;
    set: React.Dispatch<React.SetStateAction<V | null>>;
  };
  unit: {
    current: U;
    set: React.Dispatch<React.SetStateAction<U>>;
  };
};

function useUnitValueState<U, V>(
  defaultValue: V,
  defaultUnit: U
): UnitValueState<U, V> {
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

function toUnitValue<U, V>(
  unitValueState: UnitValueState<U, V>
): UnitValue<U, V> {
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
    timeSpent,
    taskLifetime,
    taskFrequency
  ].every(isFilled);

  return (
    <div className="App">
      <div className="content">
        <TaskForm
          taskDuration={taskDuration}
          timeShaved={timeShaved}
          timeSpent={timeSpent}
          taskLifetime={taskLifetime}
          taskFrequency={taskFrequency}
        />

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

export default App;
