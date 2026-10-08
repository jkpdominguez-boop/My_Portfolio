/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");

const navMenu = document.getElementById("navMenu");


if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        navMenu.classList.toggle("open");

    });

}


/* =====================================================
   CLOSE MOBILE MENU WHEN CLICKING LINK
===================================================== */

const navLinks =
    document.querySelectorAll("#navMenu a");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navMenu.classList.remove("open");

    });

});


/* =====================================================
   IMAGE MODAL
===================================================== */

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalContent =
    document.getElementById("modalContent");

const closeModal =
    document.getElementById("closeModal");


function openImage(imagePath, title) {

    modalTitle.textContent = title;

    modalContent.innerHTML = `
        <img
            src="${imagePath}"
            alt="${title}"
            class="modal-image"
        >
    `;

    modal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   CLOSE MODAL
===================================================== */

if (closeModal) {

    closeModal.addEventListener("click", function () {

        closeTheModal();

    });

}


function closeTheModal() {

    modal.classList.remove("show");

    modalContent.innerHTML = "";

    document.body.style.overflow = "";

}


/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE
===================================================== */

if (modal) {

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            closeTheModal();

        }

    });

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeTheModal();

    }

});


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message) {

    modalTitle.textContent = "Portfolio";

    modalContent.innerHTML = `
        <p class="message-text">
            ${message}
        </p>
    `;

    modal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   3D CARD TILT
===================================================== */

const cards =
    document.querySelectorAll(".tilt-card");


cards.forEach(function (card) {

    card.addEventListener("mousemove", function (event) {

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -5;

        const rotateY =
            ((x - centerX) / centerX) * 5;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

    });


    card.addEventListener("mouseleave", function () {

        card.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg)";

    });

});


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".portfolio-card, .profile-card, .about-text, .contact-card"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach(function (element) {

    observer.observe(element);

});