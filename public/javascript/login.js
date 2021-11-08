async function signUpHandler(event) {
    event.preventDefault();

    const username = document.querySelector("#sign-up-username");
    const password = document.querySelector("#sign-up-password");
}

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