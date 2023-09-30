let falling_velocity = function (seconds: number) {
    let velocity = seconds * 9.8;
    return velocity;
}
let result = falling_velocity(5);
console.log(result);
if (Math.random() < 0.5) {
    console.log("you win!")
}

// function that returns true if given number < 10, othewise resturns false
let number = function (n: number) {
    if (n < 10) {
        return true;
    } else {
        return false;
    }
}
let element = document.getElementById("mleb");
if (element instanceof HTMLElement) {
    element.innerText = "OwO";
}