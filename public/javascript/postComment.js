async function postComment(event) {
    event.preventDefault();

    const userId = parseInt(document.querySelector("#user_id").value);
    const postId = parseInt(document.querySelector("#post_id").value);
    const commentText = document.querySelector("#comment_text").value.trim();

    if(commentText) {
        const response = await fetch(`/api/comments`, {
            method: "POST",
            body: JSON.stringify({
                user_id: userId,
                post_id: postId,
                comment_text: commentText
            }),
            headers: { "Content-Type": "application/json" }
        });

        if(response.ok) {
            window.location.replace(`/posts/${postId}`);
        } else {
            alert(response.statusText);
        }
    }
    
}

document.querySelector("#add-comment").addEventListener("submit", postComment);