const DB_NAME = "CarlPortfolioDB";

const DB_VERSION = 1;

const STORE_NAME = "quizzes";



/*OPEN DATABASE*/

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        request.onupgradeneeded = function (event) {

            const database =
                event.target.result;


            if (!database.objectStoreNames.contains(STORE_NAME)) {

                database.createObjectStore(
                    STORE_NAME
                );

            }

        };


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}



/* SAVE QUIZ */

async function saveQuiz(
    quizId,
    imageFile
) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.put(
                    imageFile,
                    quizId
                );


            request.onsuccess =
                function () {

                    resolve();

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}



/*GET QUIZ*/

async function getQuiz(quizId) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.get(quizId);


            request.onsuccess =
                function () {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}



/*DELETE QUIZ*/

async function removeQuiz(quizId) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.delete(quizId);


            request.onsuccess =
                function () {

                    resolve();

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}



/*UPLOAD QUIZ*/

async function uploadQuiz(quizId) {

    const fileInput =
        document.getElementById(
            quizId + "File"
        );


    if (!fileInput.files.length) {

        alert(
            "Please choose an image first."
        );

        return;

    }


    const file =
        fileInput.files[0];



    if (!file.type.startsWith("image/")) {

        alert(
            "Please choose an image file."
        );

        return;

    }
    const maxSize =
        50 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "The image is too large. " +
            "Please choose an image smaller than 50MB."
        );

        return;

    }


    try {

        await saveQuiz(
            quizId,
            file
        );


        alert(
            "Quiz uploaded successfully!"
        );


        fileInput.value = "";


        await displayQuiz(
            quizId
        );


    }
    catch (error) {

        console.error(error);


        alert(
            "Something went wrong while saving the quiz."
        );

    }

}

/*DISPLAY QUIZ*/

async function displayQuiz(quizId) {

    try {

        const file =
            await getQuiz(
                quizId
            );


        const image =
            document.getElementById(
                quizId + "Image"
            );


        const message =
            document.getElementById(
                quizId + "Message"
            );


        if (!file) {

            image.style.display =
                "none";

            message.style.display =
                "block";

            return;

        }
        const imageURL =
            URL.createObjectURL(
                file
            );


        image.src =
            imageURL;


        image.style.display =
            "block";


        message.style.display =
            "none";

        image.onclick =
            function () {

                window.open(
                    imageURL,
                    "_blank"
                );

            };

    }
    catch (error) {

        console.error(
            "Error displaying quiz:",
            error
        );

    }

}



/*DELETE QUIZ BUTTON*/

async function deleteQuiz(quizId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this quiz?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await removeQuiz(
            quizId
        );


        alert(
            "Quiz deleted successfully."
        );


        await displayQuiz(
            quizId
        );

    }
    catch (error) {

        console.error(error);


        alert(
            "Unable to delete the quiz."
        );

    }

}



/*LOAD QUIZZES WHEN PAGE OPENS*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayQuiz("quiz1");

        displayQuiz("quiz2");

        displayQuiz("quiz3");

    }
);