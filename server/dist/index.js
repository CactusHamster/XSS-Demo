"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ws_1 = require("ws");
var node_http_1 = require("node:http");
var node_process_1 = require("node:process");
var node_buffer_1 = require("node:buffer");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
// Set up server globals.
var app = (0, express_1.default)();
var server = new node_http_1.Server(app);
var wss = new ws_1.WebSocketServer({ server: server });
// sha256
var sha256 = function (data) { return (0, node_crypto_1.createHash)("sha256").update(data).digest().toString("hex"); };
var USERS = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.resolve)("users.json")).toString());
var get_user_by_id = function (id) { var _a; return (_a = USERS.find(function (user) { return user.id == id; })) !== null && _a !== void 0 ? _a : null; };
var get_user_by_username = function (uname) { var _a; return (_a = USERS.find(function (user) { return user.username == uname; })) !== null && _a !== void 0 ? _a : null; };
// Express middleware.
var body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
// Broadcast function.
var broadcast = function (data) { return wss.clients.forEach(function (client) { return client.send(data); }); };
// Authentication middleware.
var getuser = function (req) { return req.user; };
var auth = function (req, res, next) {
    var user;
    var auth = (function () {
        if (!req.headers)
            return false;
        var header = req.headers["authorization"];
        if (Array.isArray(header))
            header = header[0];
        if (!header)
            return false;
        var b64 = header.slice(0, header.indexOf("."));
        var id = node_buffer_1.Buffer.from(b64, "base64").toString("utf-8");
        user = get_user_by_id(id);
        return user !== null && user.token === header;
    })();
    if (!auth || !user) {
        return res
            .status(403)
            .json({ message: 'unauthorized' });
    }
    else {
        req.user = user;
        next(); // Allow the request to proceed to the route handler.
    }
};
// Server routes.
app.post("/api/login", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    var authorized = true;
    if (!username || !password)
        authorized = false;
    var user = get_user_by_username(username);
    if (!user)
        return res
            .status(404)
            .end('{ "error": "not found" }');
    if (user.passhash !== sha256(password))
        authorized = false;
    if (!authorized)
        return res
            .status(403)
            .end('{ "error": "unauthorized" }');
    else
        return res
            .status(200)
            .json({ token: user.token });
});
app.post("/api/messages", auth, function (req, res) {
    var user = getuser(req);
    if (!user)
        return res.status(400).json({ "error": "unauthorized" }).end();
    var content = req.body.content;
    broadcast(JSON.stringify({
        user: user.id,
        content: content
    }));
    res.status(200).end("{}");
});
app.get("/api/users", auth, function (req, res) {
    res
        .status(200)
        .end(JSON.stringify(USERS.map(function (_a) {
        var username = _a.username, id = _a.id, avatar = _a.avatar;
        return { username: username, id: id, avatar: avatar };
    })));
});
app.get("/api/user/:userid", function (req, res) {
    var user = get_user_by_id(req.params.userid);
    if (!user)
        return res.status(404).json({ "error": "not found" }).end();
    return res.status(200).json(user).end();
});
app.get("/api/test", auth, function (req, res) {
    return res.status(200).end("{}");
});
// Static serving.
app.use("/avatars", express_1.default.static((0, node_path_1.resolve)("avatars")));
app.use("/", express_1.default.static((0, node_path_1.resolve)((0, node_process_1.cwd)(), "..", "web")));
// Handle new WebSocket connections.
wss.on("connection", function (ws, req) {
    ws.on("error", function (e) {
        console.error("Websocket encountered an error:", e);
    });
});
server.listen(8080, "0.0.0.0");
//# sourceMappingURL=index.js.map