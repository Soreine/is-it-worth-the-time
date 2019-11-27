import React from "react";

import { formatDuration, isItWorthIt } from "./time";

/**
 * Display answer and stats for the question "Is it worth the time?"
 */
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

/**
 * Same as results, but without values
 */
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

export { Results, EmptyResults };
