document.addEventListener("DOMContentLoaded", function() {
  const openFormBtn = document.getElementById("openFormBtn");
  const popupForm = document.getElementById("popupForm");
  const closeForm = document.getElementById("closeForm");
  const petForm = document.getElementById("petForm");
  const postsContainer = document.getElementById("postsContainer");
  const filterSelect = document.getElementById("filterSelect");
  const viewPostsBtn = document.getElementById("viewPostsBtn");

  // Simulated current user ID (in a real app, use proper authentication)
  const currentUserId = "user123";

  // Load posts from localStorage (for demonstration purposes)
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Helper: Normalize pet type to lowercase for consistency.
  function normalizePetType(type) {
    return type.trim().toLowerCase();
  }

  // Function to render posts with filtering applied
  function renderPosts() {
    postsContainer.innerHTML = "";
    const filterValue = filterSelect.value; // "all", "dog", or "cat"
    let filteredPosts = posts;
    if (filterValue !== "all") {
      filteredPosts = posts.filter(
        post => normalizePetType(post.petType) === normalizePetType(filterValue)
      );
    }
    filteredPosts.forEach(post => {
      const card = document.createElement("div");
      card.classList.add("post-card");
      let cardContent = `<h4>${normalizePetType(post.petType).toUpperCase()} Found</h4>`;
      if (post.image) {
        cardContent += `<img src="${post.image}" alt="${post.petType} image" class="post-image" />`;
      }
      cardContent += `
        <p><strong>Location:</strong> ${post.location}</p>
        <p><strong>Description:</strong> ${post.description}</p>
        <p><strong>Phone:</strong> ${post.phone}</p>
      `;
      card.innerHTML = cardContent;
      // Add delete button only if the current user is the post creator
      if (post.userId === currentUserId) {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener("click", function() {
          deletePost(post.id);
        });
        card.appendChild(deleteBtn);
      }
      postsContainer.appendChild(card);
    });
  }

  // Function to delete a post by its unique id
  function deletePost(id) {
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }

  // Show popup form when "I Found a Pet" button is clicked
  openFormBtn.addEventListener("click", function() {
    popupForm.style.display = "flex";
  });

  // Hide popup form when the close icon is clicked
  closeForm.addEventListener("click", function() {
    popupForm.style.display = "none";
  });

  // Handle form submission with image upload and add a unique id to each post
  petForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const petType = normalizePetType(document.getElementById("petType").value);
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const phone = document.getElementById("phone").value; // Capture phone number
    const petImageInput = document.getElementById("petImage");
    const file = petImageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function() {
        const imageData = reader.result;
        const newPost = {
          id: Date.now(), // Unique id
          petType,
          location,
          description,
          phone,       // Save the phone number
          image: imageData,
          userId: currentUserId
        };
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
        petForm.reset();
        popupForm.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      // Fallback (should not occur because the image is required)
      const newPost = {
        id: Date.now(),
        petType,
        location,
        description,
        phone,       // Save the phone number
        image: "",
        userId: currentUserId
      };
      posts.push(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderPosts();
      petForm.reset();
      popupForm.style.display = "none";
    }
  });

  // Re-render posts whenever the filter selection changes
  filterSelect.addEventListener("change", renderPosts);

  // Scroll to posts section when "View Found Pets" button is clicked
  viewPostsBtn.addEventListener("click", function() {
    document.getElementById("postsSection").scrollIntoView({ behavior: "smooth" });
  });

  // Initial render of posts on page load
  renderPosts();
});
