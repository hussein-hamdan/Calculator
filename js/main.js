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

  if (
    currentOperand === "0" &&
    number !== "." &&
    number !== "(" &&
    number !== ")"
  ) {
    currentOperand = number.toString();
  } else {
    currentOperand = currentOperand.toString() + number.toString();
  }
  updateDisplay();
}

function chooseOperation(op) {
  let logicOp = op === "×" ? "*" : op === "÷" ? "/" : op;
  const operators = ["+", "-", "*", "/"];

  if (currentOperand === "" && fullExpression === "") return;

  if (
    fullExpression !== "" &&
    operators.includes(fullExpression.slice(-1)) &&
    currentOperand === ""
  ) {
    fullExpression = fullExpression.slice(0, -1) + logicOp;
  } else if (fullExpression === "" && currentOperand !== "") {
    fullExpression = currentOperand + logicOp;
  } else {
    fullExpression += currentOperand + logicOp;
  }
  currentOperand = "";
  updateDisplay();
}
// دالة العمليات العلمية الفورية
function scientificCommand(command) {
  let val = parseFloat(currentOperand);
  if (isNaN(val) && command !== "pi") return;

  switch (command) {
    case "sin":
      // التحويل من درجات إلى راديان
      currentOperand = Math.sin((val * Math.PI) / 180).toFixed(8);
      break;
    case "cos":
      currentOperand = Math.cos((val * Math.PI) / 180).toFixed(8);
      break;
    case "tan":
      currentOperand = Math.tan((val * Math.PI) / 180).toFixed(8);
      break;
    case "sqrt":
      currentOperand = Math.sqrt(val).toString();
      break;
    case "log":
      currentOperand = Math.log10(val).toString();
      break;
    case "exp":
      currentOperand = Math.exp(val).toString();
      break;
    case "pow2":
      currentOperand = Math.pow(val, 2).toString();
      break;
    case "log10":
      currentOperand = Math.pow(10, val).toString();
      break;
    case "pi":
      currentOperand = Math.PI.toFixed(8).toString();
      break;
    case "fact":
      currentOperand = factorial(val).toString();
      break;
  }
  // تنظيف الأصفار الزائدة الناتجة عن toFixed
  currentOperand = parseFloat(currentOperand).toString();
  updateDisplay();
}

function factorial(n) {
  if (n < 0) return "Error";
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = n; i > 1; i--) result *= i;
  return result;
}
function compute() {
  if (currentOperand === "" && fullExpression === "") return;
  let finalExpression = fullExpression + currentOperand;
  try {
    let result = eval(finalExpression);
    // let result = new Function("return " + finalExpression)();
    if (!isFinite(result)) {
      currentOperand = "Error";
    } else {
      currentOperand = result.toString();
    }
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
    .replace(/\*\*/g, "^")
    .replace(/%/g, " Mod ")
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

function clearDisplay() {
  currentOperand = "0";
  updateDisplay();
}

function toggleSign() {
  currentOperand *= -1;
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
  if (key === "(") {
    appendNumber(key);
  }
  if (key === ")") {
    appendNumber(key);
  }
});
