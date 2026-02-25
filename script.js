const wordListTextArea = document.getElementById("word-list");
const generatePasswordButton = document.getElementById("generate-password");
const generatedPasswordSpan = document.getElementById("generated-password");
const toast = document.getElementById("toast");

const wordListUrl = "wordlist.txt";

async function loadWordList() {
    try {
        const response = await fetch(wordListUrl);
        const data = await response.text();
        wordListTextArea.value = data;
        generatePassword();
    } catch (error) {
        console.error("Error loading word list:", error);
    }
}

function getWordList() {
    return wordListTextArea.value
        .split("\n")
        .map(word => word.trim())
        .filter(Boolean);
}

function secureRandomIndex(maxExclusive) {
    if (maxExclusive <= 0) return 0;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % maxExclusive;
}

function selectRandomWords(wordList, count) {
    return Array.from({ length: count }, () => {
        const word = wordList[secureRandomIndex(wordList.length)];
        return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
    });
}

function generatePassword() {
    const wordList = getWordList();
    if (wordList.length < 3) {
        alert("Please provide at least three words in the list.");
        return;
    }

    const selectedWords = selectRandomWords(wordList, 3);
    const digits = Array.from({ length: 2 }, () => secureRandomIndex(10));
    const password = `${selectedWords[0]}${digits[0]}${selectedWords[1]}${digits[1]}${selectedWords[2]}`;

    generatedPasswordSpan.textContent = password;
    generatedPasswordSpan.style.cursor = "pointer";
    generatedPasswordSpan.title = "Click to copy";
}

async function copyPassword(element) {
    const password = element.textContent;
    if (!password) return;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(password);
        } else {
            fallbackCopy(password);
        }
        showToast();
    } catch (err) {
        fallbackCopy(password);
        showToast();
    }
}

function fallbackCopy(password) {
    const tempInput = document.createElement("textarea");
    tempInput.value = password;
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function showToast() {
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

generatePasswordButton.addEventListener("click", generatePassword);
generatedPasswordSpan.addEventListener("click", () => copyPassword(generatedPasswordSpan));

loadWordList();
