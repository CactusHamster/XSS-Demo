"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var getinput = function (id) {
    var input_box = document.getElementById(id);
    if (!(input_box instanceof HTMLInputElement))
        throw new Error("Failed to find input box.");
    var input = input_box.value;
    return input;
};
/**
 * @desc Attempt a login.
 */
var login = function () {
    return __awaiter(this, void 0, void 0, function () {
        var user, password, payload, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = getinput("username-box");
                    password = getinput("password-box");
                    if (user == "")
                        return [2 /*return*/, alert("Username is required.")];
                    if (password == "")
                        return [2 /*return*/, alert("Password is required.")];
                    payload = JSON.stringify({
                        username: user,
                        password: password
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/login", {
                            body: payload,
                            method: "POST",
                            headers: { "Content-Type": "application/json" }
                        })
                            .then(function (r) { return r.json(); })];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [2 /*return*/, alert("Failed to contact server.")];
                case 4:
                    if (!("token" in result))
                        return [2 /*return*/, alert("Incorrect username/password.")];
                    else {
                        localStorage.setItem("token", result.token);
                        window.location.replace("/");
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var loginbutton = document.getElementById("continue-button");
if (loginbutton instanceof HTMLInputElement) {
    loginbutton.onclick = login;
}
document.addEventListener("keypress", function (_a) {
    var key = _a.key;
    if (key == "Enter")
        login();
});
//# sourceMappingURL=login.js.map