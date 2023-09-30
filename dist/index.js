"use strict";
var falling_velocity = function (seconds) {
    var velocity = seconds * 9.8;
    return velocity;
};
var result = falling_velocity(5);
console.log(result);
if (Math.random() < 0.5) {
    console.log("you win!");
}
// function that returns true if given number < 10, othewise resturns false
var number = function (n) {
    if (n < 10) {
        return true;
    }
    else {
        return false;
    }
};
var element = document.getElementById("mleb");
if (element instanceof HTMLElement) {
    element.innerText = "OwO";
}
