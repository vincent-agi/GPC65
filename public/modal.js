// Gallery Modal Functions
function openModal(type) {
  const modal = document.getElementById("gallery-modal");
  const imageContent = document.getElementById("modal-image-content");
  const videoContent = document.getElementById("modal-video-content");
  const modalImg = document.getElementById("modal-img");
  const modalVideo = document.getElementById("modal-video");

  modal.classList.remove("hidden");
  imageContent.style.display = "none";
  videoContent.style.display = "none";

  if (type === "img1") {
    modalImg.src =
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
    modalImg.alt = "Vue détaillée patrimoine 1";
    imageContent.style.display = "block";
  } else if (type === "img2") {
    modalImg.src =
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80";
    modalImg.alt = "Vue détaillée patrimoine 2";
    imageContent.style.display = "block";
  } else if (type === "img3") {
    modalImg.src =
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";
    modalImg.alt = "Vue détaillée patrimoine 3";
    imageContent.style.display = "block";
  } else if (type === "img4") {
    modalImg.src =
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";
    modalImg.alt = "Vue détaillée patrimoine 4";
    imageContent.style.display = "block";
  } else if (type === "video") {
    modalVideo.src = "https://www.youtube.com/embed/8Qn2hQyYF0Q?autoplay=1";
    videoContent.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-img");
  const modalVideo = document.getElementById("modal-video");

  modal.classList.add("hidden");
  modalImg.src = "";
  modalVideo.src = "";
}

// Close modal on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});
