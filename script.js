/* =========================
   QUIZ UPLOAD
========================= */

function uploadQuiz(quizNumber) {

    const fileInput = document.getElementById(quizNumber + "File");
    const image = document.getElementById(quizNumber + "Image");
    const message = document.getElementById(quizNumber + "Message");

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please choose an image first.");
        return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        image.src = event.target.result;

        image.classList.add("show");

        message.style.display = "none";
    };

    reader.readAsDataURL(file);
}


/* =========================
   DELETE QUIZ
========================= */

function deleteQuiz(quizNumber) {

    const fileInput = document.getElementById(quizNumber + "File");
    const image = document.getElementById(quizNumber + "Image");
    const message = document.getElementById(quizNumber + "Message");

    image.src = "";

    image.classList.remove("show");

    message.style.display = "block";

    fileInput.value = "";
}


/* =========================
   LABORATORY UPLOAD
========================= */

function uploadLab(labNumber) {

    const fileInput = document.getElementById(labNumber + "File");
    const image = document.getElementById(labNumber + "Image");
    const message = document.getElementById(labNumber + "Message");

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please choose an image first.");
        return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        image.src = event.target.result;

        image.classList.add("show");

        message.style.display = "none";
    };

    reader.readAsDataURL(file);
}


/* =========================
   DELETE LABORATORY
========================= */

function deleteLab(labNumber) {

    const fileInput = document.getElementById(labNumber + "File");
    const image = document.getElementById(labNumber + "Image");
    const message = document.getElementById(labNumber + "Message");

    image.src = "";

    image.classList.remove("show");

    message.style.display = "block";

    fileInput.value = "";
}