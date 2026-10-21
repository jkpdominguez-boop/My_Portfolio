
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

const modal = document.getElementById("previewModal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

// MOBILE NAVIGATION

menuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation");
    });
});

// OPEN POPUP

function openModal(title, element) {
    modalTitle.textContent = title;
    modalContent.replaceChildren(element);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    modalClose.focus();
}

// CLOSE POPUP

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    modalContent.replaceChildren();
    document.body.style.overflow = "";
}

// QUIZ, LABORATORY, AND EXAM IMAGES

document.querySelectorAll("[data-image]").forEach(button => {
    button.addEventListener("click", () => {
        const imagePath = button.dataset.image;
        const title = button.dataset.title || "Preview";

        const image = document.createElement("img");
        image.className = "modal-image";
        image.alt = title;

        image.addEventListener("error", () => {
            if (!modal.classList.contains("open")) return;

            const message = document.createElement("p");
            message.className = "modal-message";
            message.textContent =
                `Image "${imagePath}" was not found. Check the filename and folder.`;

            modalContent.replaceChildren(message);
        }, { once: true });

        image.src = imagePath;
        openModal(title, image);
    });
});

// MISSING FILE MESSAGES

document.querySelectorAll("[data-message]").forEach(button => {
    button.addEventListener("click", () => {
        const message = document.createElement("p");
        message.className = "modal-message";
        message.textContent = button.dataset.message;

        openModal(button.textContent.trim(), message);
    });
});

// CLOSE BUTTON

modalClose.addEventListener("click", closeModal);

// CLOSE WHEN CLICKING OUTSIDE THE POPUP

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

// CLOSE USING ESCAPE KEY

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        modal.classList.contains("open")
    ) {
        closeModal();
    }
});
