let currentOperand = "0";
let fullExpression = ""; // لتخزين العملية الكاملة تراكمياً

const currentTextElement = document.getElementById("current-operand");
const previousTextElement = document.getElementById("previous-operand");

// وظيفة التبديل بين الوضعين
function toggleScientific() {
  const calc = document.getElementById("calc");
  calc.classList.toggle("scientific-mode");
}

function appendNumber(number) {
  if (number === "." && currentOperand.includes(".")) return;

  if (currentOperand === "0" && number !== ".") {
    currentOperand = number.toString();
  } else {
    currentOperand = currentOperand.toString() + number.toString();
  }
  updateDisplay();
}

function chooseOperation(op) {
  // استبدال الرموز لتعمل برمجياً (× تصبح * و ÷ تصبح /)
  let visualOp = op;
  let logicOp = op === "×" ? "*" : op === "÷" ? "/" : op;

  if (currentOperand === "" && fullExpression === "") return;

  if (fullExpression === "" && currentOperand !== "") {
    fullExpression = currentOperand + logicOp;
  } else {
    fullExpression += currentOperand + logicOp;
  }

  currentOperand = "";
  updateDisplay();
}

function compute() {
  if (currentOperand === "" && fullExpression === "") return;

  let finalExpression = fullExpression + currentOperand;

  try {
    let result = new Function("return " + finalExpression)();

    currentOperand = result.toString();
    fullExpression = "";
    operation = undefined;
  } catch (error) {
    currentOperand = "Error";
  }

  updateDisplay();
}

function updateDisplay() {
  currentTextElement.innerText = currentOperand;
  previousTextElement.innerText = fullExpression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷");
}

function allClear() {
  currentOperand = "0";
  fullExpression = "";
  updateDisplay();
}

function deleteNumber() {
  if (currentOperand === "0") return;
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === "") currentOperand = "0";
  updateDisplay();
}

// إضافة مراقب أحداث للوحة المفاتيح
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    appendNumber(key);
  }

  if (key === "+" || key === "-") {
    chooseOperation(key);
  }
  if (key === "*") {
    chooseOperation("×");
  }
  if (key === "/") {
    event.preventDefault();
    chooseOperation("÷");
  }

  // زر Enter للحساب (=)
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    compute();
  }

  if (key === "Backspace") {
    deleteNumber();
  }
  if (key === "Escape") {
    allClear();
  }
});
