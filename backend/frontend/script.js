const postForm = document.getElementById('postForm');
const postContainer = document.getElementById('postContainer');

//Load Posts
async function loadPosts() {
    const response = await fetch(`/posts`);
    const posts = await response.json();

    postContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement =document.createElement('div');

        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <h3>${post.author}</h3>
            <p id="content-${post._id}">${post.content}</p>
            <small>${new Date(post.createdAt).toLocaleString()}</small>
            <p>❤️ ${post.likes}</p>

            <button onclick="likePost('${post._id}')">
                Like
            </button>

            <button onclick="deletePost('${post._id}')">
                Delete
            </button>

            <button onclick="editPost('${post._id}', '${post.content}')">
                Edit
            </button>
        `;

        postContainer.appendChild(postElement);
    });
};

//Delete Post
async function deletePost(id) {
    await fetch(`/posts/${id}`, {
        method: 'DELETE'
    });

    loadPosts();
};

//Edit Post
async function editPost(id, currentContent) {
    const newContent = prompt('Edit your post:', currentContent);
    if (!newContent) return;

    await fetch(`/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ content: newContent })
    });
    
    loadPosts();
};

async function likePost(id) {
    await fetch(`/posts/${id}/like`, {
        method: 'POST'
    });

    loadPosts();
}

//Create Post
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    await fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author,
            content
        })
    });

    postForm.reset();

    loadPosts();

    alert('Post created successfuly!');
});

//Load Posts when page opens
loadPosts();
