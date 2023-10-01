interface User {
    username: string,
    avatar: string,
    id: string
}
interface Message {

}

type payloadData = string | Blob | Record<string, string>;
class API {
    token: string;
    users: Map<string, User> = new Map();
    constructor (token: string) {
        this.token = token;
    }
    async test_auth (): Promise<boolean> {
        try {
            await this.get("/test");
            return true;
        } catch (e) {
            return false;
        }
    }
    async fetch (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<any | null> {
        if (typeof input == "string") input = "/api" + input;
        if (!init) init = {};
        if (init.headers instanceof Headers) init.headers.append("Authorization", this.token);
        else if (Array.isArray(init.headers)) init.headers.push(["Authorization", this.token]);
        else if (typeof init.headers == "undefined") init.headers = { "Authorization": this.token };
        else init.headers["Authorization"] = this.token;
        let result = await window.fetch(input, init);
        let text = await result.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error(text);
            console.error(e);
            return null;
        }
        return json;
    }
    upload (input: RequestInfo, payload: payloadData, init?: RequestInit | undefined): Promise<any | null> {
        if (!init) init = {};
        if (!init.method) init.method = "POST";
        if (!init.headers) init.headers = { "content-type": "application/json" };
        if (!(payload instanceof Blob) && typeof payload !== "string") payload = JSON.stringify(payload);
        init.body = payload;
        return this.fetch(input, init);
    }
    get (path: string): Promise<any | null> {
        return this.fetch(path);
    }
    post (path: string, data: payloadData): Promise<any | null> {
        return this.upload(path, data, { method: "POST" });
    }
    patch (path: string, data: payloadData): Promise<any | null> {
        return this.upload(path, data, { method: "PATCH" });
    }
    async http_getusers (): Promise<Map<string, User>> {
        let users = await this.get("/users");
        if (!users) throw new Error("API error.");
        if (!Array.isArray(users)) throw new Error("Unexpected response.");
        users.forEach(user => {
            this.users.set(user.id, user);
        })
        return this.users;
    }
    async http_getuser (id: string): Promise<User | null> {
        return this.get(`/user/${id}`);
    }
    async getuser (id: string): Promise<User | null> {
        let user: User | null = this.users.get(id) ?? null;
        if (!user) user = await this.http_getuser(id);
        return user;
    } 
}
const api = new API(localStorage.getItem("token") ?? "none");
api.test_auth().then(result => {
    if (!result) window.location.replace("/login.html");
})

const id = (id: string, T: any = HTMLElement): typeof T => {
    let result = document.getElementById(id);
    if (!(result instanceof T)) throw new Error("Failed to find element.");
    return result as typeof T;
}
async function adduserdiv (id: string | User) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) throw new Error("Failed to find sidebar.");
    const parentdiv = document.createElement("div");
    parentdiv.classList.add("user-container");
    const user = typeof id === "string" ? await api.getuser(id) : id;
    if (!user) throw new Error("user not found")
    const img = document.createElement("img");
    img.classList.add("avatar");
    img.src = "/avatars/" + user.avatar;
    parentdiv.appendChild(img);
    const span = document.createElement("span")
    span.classList.add("username");
    span.innerText = user.username;
    parentdiv.appendChild(span);
    sidebar.appendChild(parentdiv);
}
function deluserdiv (id: string) {

}

const ws = new WebSocket("ws://" + window.location.host)

let sendbutton = id("message-send-button");
sendbutton.onclick = () => sendTextboxText();
let textbox = id("message-content-box");
if (textbox instanceof HTMLInputElement) textbox.addEventListener("keypress", (key) => {
    if (key.key == "Enter") sendTextboxText();
})

api.http_getusers()
.then(result => {
    result.forEach(user => adduserdiv(user.id))
})

function sendmessage (text: string) { api.post("/messages", JSON.stringify({ "content": text })) }
function sendTextboxText () {
    let textbox = document.getElementById("message-content-box");
    if (!(textbox instanceof HTMLInputElement)) throw new Error("Failed to find textbox.");
    let { value: text } = textbox;
    if (!text) alert("Enter text to send.")
    sendmessage(text);
}

function displaymsg (user: User, text: string) {
    const container = document.createElement("div");
    container.classList.add("message-container");
    const img = document.createElement("img");
    img.src = "/avatars/" + user.avatar;
    img.classList.add("message-avatar");
    const span = document.createElement("span");
    span.classList.add("message-text");
    span.innerHTML = `|${user.username}|: ${text}`;
    container.appendChild(img);
    container.appendChild(span);
    id("messages-box").appendChild(container);
}

ws.addEventListener("message", async (msg) => {
    let { user: userid, content } = JSON.parse(msg.data.toString());
    const user = await api.getuser(userid);
    if (!user) return console.error(`Missed message: ${user} | ${content}`)
    displaymsg(user, content)
});