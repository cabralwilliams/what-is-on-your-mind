async function editPost(event) {
    event.preventDefault();
    
    const postTitle = document.querySelector("#title").value.trim();
    const postText = document.querySelector("#content").value.trim();
    const postId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];

    if(postTitle && postText) {
        const response = await fetch(`/api/posts/${postId}`, {
            method: "PUT",
            body: JSON.stringify({
                title: postTitle,
                content: postText
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

document.querySelector("#post-form").addEventListener("submit", editPost);

async function deletePost(event) {
    event.preventDefault();

    //Get the post id from the url
    const postId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
    const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE"
    });

    if(response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
    }
}

document.querySelector("#delete-form").addEventListener("submit", deletePost);