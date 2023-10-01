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
var _a;
var API = /** @class */ (function () {
    function API(token) {
        this.users = new Map();
        this.token = token;
    }
    API.prototype.test_auth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.get("/test")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    API.prototype.fetch = function (input, init) {
        return __awaiter(this, void 0, void 0, function () {
            var result, text, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof input == "string")
                            input = "/api" + input;
                        if (!init)
                            init = {};
                        if (init.headers instanceof Headers)
                            init.headers.append("Authorization", this.token);
                        else if (Array.isArray(init.headers))
                            init.headers.push(["Authorization", this.token]);
                        else if (typeof init.headers == "undefined")
                            init.headers = { "Authorization": this.token };
                        else
                            init.headers["Authorization"] = this.token;
                        return [4 /*yield*/, window.fetch(input, init)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        text = _a.sent();
                        try {
                            json = JSON.parse(text);
                        }
                        catch (e) {
                            console.error(text);
                            console.error(e);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    API.prototype.upload = function (input, payload, init) {
        if (!init)
            init = {};
        if (!init.method)
            init.method = "POST";
        if (!init.headers)
            init.headers = { "content-type": "application/json" };
        if (!(payload instanceof Blob) && typeof payload !== "string")
            payload = JSON.stringify(payload);
        init.body = payload;
        return this.fetch(input, init);
    };
    API.prototype.get = function (path) {
        return this.fetch(path);
    };
    API.prototype.post = function (path, data) {
        return this.upload(path, data, { method: "POST" });
    };
    API.prototype.patch = function (path, data) {
        return this.upload(path, data, { method: "PATCH" });
    };
    API.prototype.http_getusers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("/users")];
                    case 1:
                        users = _a.sent();
                        if (!users)
                            throw new Error("API error.");
                        if (!Array.isArray(users))
                            throw new Error("Unexpected response.");
                        users.forEach(function (user) {
                            _this.users.set(user.id, user);
                        });
                        return [2 /*return*/, this.users];
                }
            });
        });
    };
    API.prototype.http_getuser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("/user/".concat(id))];
            });
        });
    };
    API.prototype.getuser = function (id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = (_a = this.users.get(id)) !== null && _a !== void 0 ? _a : null;
                        if (!!user) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.http_getuser(id)];
                    case 1:
                        user = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, user];
                }
            });
        });
    };
    return API;
}());
var api = new API((_a = localStorage.getItem("token")) !== null && _a !== void 0 ? _a : "none");
api.test_auth().then(function (result) {
    if (!result)
        window.location.replace("/login.html");
});
var id = function (id, T) {
    if (T === void 0) { T = HTMLElement; }
    var result = document.getElementById(id);
    if (!(result instanceof T))
        throw new Error("Failed to find element.");
    return result;
};
function adduserdiv(id) {
    return __awaiter(this, void 0, void 0, function () {
        var sidebar, parentdiv, user, _a, img, span;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sidebar = document.getElementById("sidebar");
                    if (!sidebar)
                        throw new Error("Failed to find sidebar.");
                    parentdiv = document.createElement("div");
                    parentdiv.classList.add("user-container");
                    if (!(typeof id === "string")) return [3 /*break*/, 2];
                    return [4 /*yield*/, api.getuser(id)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = id;
                    _b.label = 3;
                case 3:
                    user = _a;
                    if (!user)
                        throw new Error("user not found");
                    img = document.createElement("img");
                    img.classList.add("avatar");
                    img.src = "/avatars/" + user.avatar;
                    parentdiv.appendChild(img);
                    span = document.createElement("span");
                    span.classList.add("username");
                    span.innerText = user.username;
                    parentdiv.appendChild(span);
                    sidebar.appendChild(parentdiv);
                    return [2 /*return*/];
            }
        });
    });
}
function deluserdiv(id) {
}
var ws = new WebSocket("ws://" + window.location.host);
var sendbutton = id("message-send-button");
sendbutton.onclick = function () { return sendTextboxText(); };
var textbox = id("message-content-box");
if (textbox instanceof HTMLInputElement)
    textbox.addEventListener("keypress", function (key) {
        if (key.key == "Enter")
            sendTextboxText();
    });
api.http_getusers()
    .then(function (result) {
    result.forEach(function (user) { return adduserdiv(user.id); });
});
function sendmessage(text) { api.post("/messages", JSON.stringify({ "content": text })); }
function sendTextboxText() {
    var textbox = document.getElementById("message-content-box");
    if (!(textbox instanceof HTMLInputElement))
        throw new Error("Failed to find textbox.");
    var text = textbox.value;
    if (!text)
        alert("Enter text to send.");
    sendmessage(text);
}
function displaymsg(user, text) {
    var container = document.createElement("div");
    container.classList.add("message-container");
    var img = document.createElement("img");
    img.src = "/avatars/" + user.avatar;
    img.classList.add("message-avatar");
    var span = document.createElement("span");
    span.classList.add("message-text");
    span.innerHTML = "|".concat(user.username, "|: ").concat(text);
    container.appendChild(img);
    container.appendChild(span);
    id("messages-box").appendChild(container);
}
ws.addEventListener("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userid, content, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = JSON.parse(msg.data.toString()), userid = _a.user, content = _a.content;
                return [4 /*yield*/, api.getuser(userid)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, console.error("Missed message: ".concat(user, " | ").concat(content))];
                displaymsg(user, content);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map