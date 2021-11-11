async function addPost(event) {
    event.preventDefault();
    
    const postTitle = document.querySelector("#title").value.trim();
    const postText = document.querySelector("#content").value.trim();

    if(postTitle && postText) {
        const response = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                title: postTitle,
                content: postText,
                user_id: parseInt(document.querySelector("#userId").value)
            }),
            headers: { "Content-Type": "application/json" }
        });

        if(response.ok) {
            window.location.replace("/dashboard");
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector("#post-form").addEventListener("submit", addPost);