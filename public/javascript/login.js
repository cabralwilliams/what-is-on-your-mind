async function signUpHandler(event) {
    event.preventDefault();

    const username = document.querySelector("#sign-up-username").value.trim();
    //console.log(username);
    const password = document.querySelector("#sign-up-password").value.trim();
    //console.log(password);

    if(username && password) {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: { "Content-Type":"application/json" }
        });

        //console.log(response);

        if(response.ok) {
            document.location.replace("/dashboard");
        } else {
            alert(response.statusText + `\nYour account could not be created likely because of one of these three reasons.\n1. The username you chose, ${username}, is already in use.\n2. The username you chose, ${username}, is not at least 4 characters in length.\n3. Your password is not at least 6 characters long and/or contains characters other than letters and numbers.`);
        }
    }
}

document.querySelector("#signUpForm").addEventListener("submit", signUpHandler);

async function signInHandler(event) {
    event.preventDefault();
    
    const username = document.querySelector("#sign-in-username").value.trim();
    const password = document.querySelector("#sign-in-password").value.trim();

    if(username && password) {
        const response = await fetch("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: { "Content-Type":"application/json" }
        });

        if(response.ok) {
            document.location.replace("/dashboard");
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector("#signInForm").addEventListener("submit", signInHandler);