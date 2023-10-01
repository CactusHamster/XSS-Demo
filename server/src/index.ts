import express, { NextFunction, Request, Response } from "express";
import { WebSocket, WebSocketServer } from "ws"
import { Server, IncomingMessage } from "node:http";
import { env as ENV, cwd as CWD } from "node:process";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
// Set up server globals.
const app = express();
const server = new Server(app);
const wss = new WebSocketServer({ server });
// sha256
const sha256 = (data: string) => createHash("sha256").update(data).digest().toString("hex")
// Set up extremely simple/slow database.
interface User {
    username: string,
    avatar: string,
    passhash: string,
    id: string,
    token: string
}
const USERS: User[] = JSON.parse(readFileSync(resolve("users.json")).toString());
const get_user_by_id = (id: string): User | null => USERS.find(user => user.id == id) ?? null;
const get_user_by_username = (uname: string): User | null => USERS.find(user => user.username == uname) ?? null;

// Express middleware.
import bodyparser from "body-parser";
app.use(bodyparser.json());

// Broadcast function.
let broadcast = (data: Buffer | string) => wss.clients.forEach(client => client.send(data));

// Authentication middleware.
const getuser = (req: Request): User | null => (req as any).user;
const auth = (req: Request, res: Response, next: NextFunction) => {
    let user;
    let auth = (() => {
        if (!req.headers) return false;
        let header = req.headers["authorization"];
        if (Array.isArray(header)) header = header[0];
        if (!header) return false;
        let b64 = header.slice(0, header.indexOf("."));
        let id = Buffer.from(b64,"base64").toString("utf-8");
        user = get_user_by_id(id);
        return user !== null && user.token === header;
    })();
    
    if (!auth || !user) {
        return res
            .status(403)
            .json({ message: 'unauthorized' });
    } else {
        (req as any).user = user;
        next(); // Allow the request to proceed to the route handler.
    }
}

// Server routes.
app.post("/api/login", (req, res) => {
    let { username, password } = req.body;
    let authorized = true;
    if (!username || !password) authorized = false;
    let user = get_user_by_username(username);
    if (!user) return res
        .status(404)
        .end('{ "error": "not found" }');
    if (user.passhash !== sha256(password)) authorized = false;
    if (!authorized) return res
        .status(403)
        .end('{ "error": "unauthorized" }');
    else return res
        .status(200)
        .json({ token: user.token });
});
app.post("/api/messages", auth, (req, res) => {
    let user = getuser(req);
    if (!user) return res.status(400).json({ "error": "unauthorized" }).end();
    let { content } = req.body;
    broadcast(JSON.stringify({
        user: user.id,
        content: content
    }));
    res.status(200).end("{}");
});
app.get("/api/users", auth, (req, res) => {
    res
        .status(200)
        .end( JSON.stringify(USERS.map(({ username, id, avatar }) => { return { username, id, avatar } })) );
});
app.get("/api/user/:userid", (req, res) => {
    let user = get_user_by_id(req.params.userid);
    if (!user) return res.status(404).json({ "error": "not found" }).end();
    return res.status(200).json(user).end();
})
app.get("/api/test", auth, (req, res) => {
    return res.status(200).end("{}");
})

// Static serving.
app.use("/avatars", express.static(resolve("avatars")));
app.use("/", express.static(resolve(CWD(), "..", "web")));



// Handle new WebSocket connections.
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    ws.on("error", (e) => {
        console.error("Websocket encountered an error:", e);
    });
});

server.listen(8080, "0.0.0.0");