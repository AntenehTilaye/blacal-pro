import { useEffect } from "react";
import "./App.css";
import { useState } from "react";

function App() {
  const [result, setResult] = useState("0");
  const [display, setDisplay] = useState("0");

  const operators = ["+", "-", "x", "/", "(", ")"];
  const tokenize = (dis) => {
    const splitted = dis.split("");
    let tokens = [];
    let token = "";
    for (let i of splitted) {
      if (operators.includes(i) && token !== "") {
        tokens.push(token);
        tokens.push(i);
        token = "";
      } else if (operators.includes(i)) {
        tokens.push(i);
      } else {
        token = token + i;
      }
    }

    if (token !== "") {
      tokens.push(token);
    }

    console.log("tokens: " + tokens);
    to_postfix(tokens);
  };

  const to_postfix = (infixval) => {
    var stackarr = [];
    var postfix = [];
    stackarr.push("@");

    for (var i = 0; i < infixval.length; i++) {
      var el = infixval[i];

      // Checking whether operator or not
      if (operators.includes(el)) {
        if (el === ")") {
          while (stackarr[stackarr.length - 1] !== "(") {
            postfix.push(stackarr.pop());
          }
          stackarr.pop();
        }

        // Checking whether el is (  or not
        else if (el === "(") {
          stackarr.push(el);
        }

        // Comparing precedency of el and
        // stackarr[topp]
        else if (precedency(el) > precedency(stackarr[stackarr.length - 1])) {
          stackarr.push(el);
        } else {
          while (
            precedency(el) <= precedency(stackarr[stackarr.length - 1]) &&
            stackarr.length > -1
          ) {
            postfix.push(stackarr.pop());
          }
          stackarr.push(el);
        }
      } else {
        postfix.push(el);
      }
    }

    // Adding character until stackarr[topp] is @
    while (stackarr[stackarr.length - 1] !== "@") {
      postfix.push(stackarr.pop());
    }

    console.log("post:  " + postfix);
    evaluate(postfix);
  };

  function precedency(pre) {
    if (pre === "@" || pre === "(" || pre === ")") {
      return 1;
    } else if (pre === "+" || pre === "-") {
      return 2;
    } else if (pre === "/" || pre === "x") {
      return 3;
    } else if (pre === "^") {
      return 4;
    } else return 0;
  }

  function evaluate(exp) {
    //create a stack
    let stack = [];

    // Scan all characters one by one
    for (let i = 0; i < exp.length; i++) {
      let c = exp[i];

      // If the scanned character is an operand (number here),
      // push it to the stack.
      if (!isNaN(parseInt(c))) stack.push(c.charCodeAt(0) - "0".charCodeAt(0));
      //  If the scanned character is an operator, pop two
      // elements from stack apply the operator
      else {
        let val1 = stack.pop();
        let val2 = stack.pop();

        switch (c) {
          case "+":
            stack.push(val2 + val1);
            break;

          case "-":
            stack.push(val2 - val1);
            break;

          case "/":
            stack.push(val2 / val1);
            break;

          case "x":
            stack.push(val2 * val1);
            break;
        }
      }
    }
    const res = stack.pop();
    isNaN() ? setResult(res) : setDisplay(NaN);
  }

  const button_clicked = (token) => {
    if (token === "=") {
      return;
    }
    if (
      !isNaN(display[display.length - 1]) &&
      "(" === token &&
      display !== "0"
    ) {
      setDisplay(display + "x" + token);
    } else if (
      !isNaN(display[display.length - 1]) &&
      "(" === token &&
      display === "0"
    ) {
      setDisplay(token);
    } else if (display[display.length - 1] === ")" && !isNaN(token)) {
      setDisplay(display + "x" + String(token));
    } else if (
      display[display.length - 1] === ")" &&
      ["+", "-", "/", "x"].includes(token)
    ) {
      setDisplay(display + String(token));
    } else if (display[display.length - 1] === "(" && token === "(") {
      setDisplay(display + String(token));
    } else if (display[display.length - 1] === ")" && token === ")") {
      setDisplay(display + String(token));
    } else if (
      operators.includes(display[display.length - 1]) &&
      ")" === token
    ) {
      return;
    } else if (display === "0" && operators.includes(token)) {
      return;
    } else if (
      operators.includes(display[display.length - 1]) &&
      operators.includes(token)
    ) {
      return;
    } else {
      display === "0"
        ? setDisplay(String(token))
        : setDisplay(display + String(token));
    }
  };

  useEffect(() => {
    tokenize(display);
  }, [display]);

  const reset = () => {
    setResult("0");
    setDisplay("0");
  };

  const erase = () => {
    setDisplay(
      display.length === 1 ? "0" : display.slice(0, display.length - 1)
    );
  };

  const nums = [1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "/", ".", 0, "=", "x"];

  return (
    <div className="App">
      <div className="buttons_holder">
        <h1>Blacal</h1>
        <div className="cal-result">{result}</div>
        <div className="cal-input">{display}</div>
        <div className="buttons">
          <button onClick={() => button_clicked("(")}> ( </button>
          <button onClick={() => button_clicked(")")}> ) </button>
          <button onClick={erase}> C </button>
          <button onClick={reset}>R</button>
        </div>
        <div className="buttons">
          {nums.map((obj, i) => {
            return <button onClick={() => button_clicked(obj)}>{obj}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
