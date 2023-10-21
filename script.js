const wordListTextArea = document.getElementById("word-list");
const generatePasswordButton = document.getElementById("generate-password");
const generatedPasswordSpan = document.getElementById("generated-password");
const toast = document.getElementById("toast");

// Load initial word list from the server
fetch("wordlist.txt")
    .then(response => response.text())
    .then(data => {
        wordListTextArea.value = data;
        // Generate a password after the word list has been loaded
        generatePassword();
    })
    .catch(error => console.error("Error loading word list:", error));

// Function to generate and display a password
function generatePassword() {
    const wordList = wordListTextArea.value.split('\n').map(word => word.trim());
    wordList.pop(); // Remove the last empty line

    if (wordList.length < 3) {
        alert("Please provide at least three words in the list.");
        return;
    }

    const randomIndex = () => Math.floor(Math.random() * wordList.length);
    const randomDigits = Array.from({ length: 2 }, () => Math.floor(Math.random() * 10));

    const selectedWords = Array.from({ length: 3 }, () => {
        const index = randomIndex();
        const word = wordList[index];
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const password = `${selectedWords[0]}${randomDigits[0]}${selectedWords[1]}${randomDigits[1]}${selectedWords[2]}`;

    // Set the generated password in the span
    generatedPasswordSpan.textContent = password;
    generatedPasswordSpan.style.cursor = "pointer";
    generatedPasswordSpan.title = "Click to copy";
}

generatePasswordButton.addEventListener("click", generatePassword);

generatedPasswordSpan.addEventListener("click", function() {
    copyPassword(generatedPasswordSpan);
});

function copyPassword(element) {
    const password = element.textContent;

    if (password) {
        const tempInput = document.createElement("input");
        tempInput.value = password;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Show toast notification
        toast.style.display = "block";

        setTimeout(function() {
            // Hide toast notification after 2 seconds
            toast.style.display = "none";
        }, 2000);
    }
}

