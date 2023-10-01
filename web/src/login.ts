let getinput = function (id:string) {
    let input_box = document.getElementById(id);
    if (!(input_box instanceof HTMLInputElement)) throw new Error("Failed to find input box.");
    let input = input_box.value;
    return input;
}

/**
 * @desc Attempt a login.
 */
let login = async function (): Promise<void> {
    let user = getinput("username-box");
    let password = getinput("password-box");
    if (user == "") return alert("Username is required.");
    if (password == "") return alert("Password is required.");
    let payload = JSON.stringify({
        username: user,
        password: password
    });
    let result;
    try {
        result = await fetch("/api/login", {
            body: payload,
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
        .then(r => r.json());
    } catch (e) {
        console.error(e);
        return alert("Failed to contact server.");
    }
    if (!("token" in result)) return alert("Incorrect username/password.");
    else {
        localStorage.setItem("token", result.token);
        window.location.replace("/");
    }
};

let loginbutton = document.getElementById("continue-button");
if (loginbutton instanceof HTMLInputElement) {
    loginbutton.onclick = login;
}
document.addEventListener("keypress", function ({ key }) {
    if (key == "Enter") login();
})