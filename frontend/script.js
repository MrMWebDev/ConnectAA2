const postForm = document.getElementById('postForm');
const postContainer = document.getElementById('postContainer');

//Load Posts
async function loadPosts() {
    const response =await fetch('http://localhost:300/posts');
    const posts = await response.json();

    postContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement =document.createElement('div');

        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <h3>${post.author}</h3>
            <p>${post.content}</p>
        `;

        postContainer.appendChild(postElement);
    });
}

//Create Post
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    await fetch('http://localhost:3000/posts', {
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
});

//Load Posts when page opens
loadPosts();
