import { useState } from "react";
import "./App.css";

// Safely evaluates a simple math expression string (digits, + - * / .)
// without using eval() or the Function constructor.
function calculate(expression) {
  // Tokenize the expression into numbers and operators
  const tokens = expression.match(/(\d+\.?\d*|\+|-|\*|\/)/g);
  if (!tokens || tokens.length === 0) return "";

  // First pass: resolve * and / (respects operator precedence)
  const stack = [Number(tokens[0])];
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const value = Number(tokens[i + 1]);

    if (value === undefined || Number.isNaN(value)) break;

    if (operator === "*") {
      stack.push(stack.pop() * value);
    } else if (operator === "/") {
      if (value === 0) throw new Error("Divide by zero");
      stack.push(stack.pop() / value);
    } else {
      // + or - get pushed as-is; resolved in the second pass
      stack.push(operator, value);
    }
  }

  // Second pass: resolve remaining + and -
  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    const operator = stack[i];
    const value = stack[i + 1];
    result = operator === "+" ? result + value : result - value;
  }

  return result;
}

function App() {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    if (value === "C") {
      setDisplay("");
    } else if (value === "=") {
      try {
        const result = calculate(display);
        setDisplay(result === "" ? "" : String(result));
      } catch {
        setDisplay("Error");
      }
    } else {
      
