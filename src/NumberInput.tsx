import React from "react";

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

export default NumberInput;
