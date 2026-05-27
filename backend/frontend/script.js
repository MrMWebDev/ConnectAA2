const postForm = document.getElementById("postForm");
const postContainer = document.getElementById("postContainer");

//Load Posts
async function loadPosts() {
    const response = await fetch(`/posts`);
    const posts = await response.json();

    postContainer.innerHTML = "";

    posts.forEach((post) => {
        const postElement = document.createElement("div");

        postElement.classList.add("post");

        postElement.innerHTML = `
            <h3>${post.author?.username || post.author}</h3>
            <p>${post.content}</p>

            <small>${new Date(post.createdAt).toLocaleString()}</small>
            
            <p>❤️ ${post.likes}</p>

            <button onclick="likePost('${post._id}')">Like</button>
            <button onclick="editPost('${post._id}', '${post.content}')">Edit</button>
            <button onclick="deletePost('${post._id}')">Delete</button>

            <hr>

            <div id="comments-${post._id}">
                <p>Loading comments...</p>
            </div>

            <input id="comment-input-${post._id}" placeholder="Write a comment..." />
            <button onclick="addComment('${post._id}')">Comment</button>

        `;

        postContainer.appendChild(postElement);
        loadComments(post._id);
    });
}

//Load/Add Comment
async function loadComments(postId) {
    const res = await fetch(`/posts/${postId}/comments`);
    const comments = await res.json();

    const container = document.getElementById(`comments-${postId}`);
    if (comments.length === 0) {
        container.innerHTML = "<p>No comments yet</p>";
        return;
    }

    container.innerHTML = comments
        .map(
            (comment) => `
        <p>
            <strong>${comment.author.username}:</strong>
            ${comment.content}
        </p>
    `,
        )
        .join("");
}

async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value;

    if (!content) return;

    const token = localStorage.getItem("token"); // IMPORTANT (if you store it)

    await fetch(`/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // IMPORTANT (stored token)
        },
        body: JSON.stringify({ content }),
    });

    input.value = "";
    loadComments(postId);
}

//Delete Post
async function deletePost(id) {
    await fetch(`/posts/${id}`, {
        method: "DELETE",
    });

    loadPosts();
}

//Edit Post
async function editPost(id, currentContent) {
    const newContent = prompt("Edit your post:", currentContent);
    if (!newContent) return;

    await fetch(`/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ content: newContent }),
    });

    loadPosts();
}

async function likePost(id) {
    await fetch(`/posts/${id}/like`, {
        method: "POST",
    });

    loadPosts();
}

//Create Post
postForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    const token = localStorage.getItem("token");

    const res = await fetch("/posts", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            author,
            content,
        }),
    });

    if (!res.ok) {
        alert("You must login first");
        return;
    }

    postForm.reset();

    loadPosts();

    alert("Post created successfully!");

});

//Login (IMPORTANT: This is a very basic implementation for demonstration purposes. In production, you should handle authentication more securely and robustly.)
async function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    localStorage.setItem("token", data.token);
    alert(data.message);
}

//Load Posts when page opens
loadPosts();
