import React, { useReducer, useEffect, ChangeEvent } from "react";
import { VALIDATOR_REQUIRE, validate } from "../utils/validators";
import { Root } from "../styles";

import "./Input.css";

interface InputProps {
  id: string;
  type: string;
  placeholder?: string;
  element: "input" | "textarea";
  rows?: number;
  label: string;
  initialValue?: string;
  initialValid?: boolean;
  validators?: any[];
  errorText?: string;
  style?: any
  min?: string;
  max?: string;

  onInput: (id: string, value: string, isValid: boolean) => void;
}

interface InputState {
  value: string;
  isTouched: boolean;
  isValid: boolean;
}

type InputAction =
  | { type: "CHANGE"; val: string; validators: any[] }
  | { type: "TOUCH" };

const inputReducer = (state: InputState, action: InputAction): InputState => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input: React.FC<InputProps> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators || [],
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        style={props.style}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        style={props.style}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched && "form-control--invalid "
        }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
