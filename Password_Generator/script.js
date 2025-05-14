// Wait until the page fully loads
document.addEventListener('DOMContentLoaded', () => {
    // Grab all the important elements from the DOM
    const passwordInput = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const generateBtn = document.getElementById('generate-btn');
    const lengthInput = document.getElementById('length');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const strengthLevel = document.querySelector('.strength-level');
    const baseTextInput = document.getElementById('base-text');

    // Define available characters
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Word bank to make passwords more human-friendly
    const COMMON_WORDS = [
        'sun', 'moon', 'star', 'tree', 'bird', 'fish', 'book', 'door', 'wall', 'road',
        'rain', 'snow', 'wind', 'fire', 'rock', 'lake', 'hill', 'city', 'town', 'home'
    ];

    // When the user clicks "Generate", create a password
    generateBtn.addEventListener('click', generatePassword);

    // When the user clicks the copy button, copy password to clipboard
    copyBtn.addEventListener('click', () => {
        if (passwordInput.value) {
            passwordInput.select();
            document.execCommand('copy');
            showNotification('Password copied to clipboard!');
        }
    });

    // Main password generator function
    function generatePassword() {
        const length = parseInt(lengthInput.value);
        const hasUppercase = uppercaseCheck.checked;
        const hasLowercase = lowercaseCheck.checked;
        const hasNumbers = numbersCheck.checked;
        const hasSymbols = symbolsCheck.checked;
        const baseText = baseTextInput.value.trim();

        // Make sure the user selected at least one character type
        if (!hasUppercase && !hasLowercase && !hasNumbers && !hasSymbols) {
            showNotification('Please select at least one character type!', 'error');
            return;
        }

        // Make sure length is within reasonable bounds
        if (length < 8 || length > 32) {
            showNotification('Password length must be between 8 and 32 characters!', 'error');
            return;
        }

        let password = '';

        // Start with user input or a random word
        if (baseText) {
            // Use the first word or up to 4 characters
            const baseWord = baseText.split(' ')[0].slice(0, 4);
            password += baseWord;
        } else {
            // Pick a random word to start with
            const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
            password += randomWord;
        }

        // Optionally add a number (like part of the year or a random number)
        if (hasNumbers) {
            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 100);
            password += (year % 100) + randomNum;
        }

        // Optionally add a symbol
        if (hasSymbols) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            password += symbol;
        }

        // Add a second random word to make it a bit longer
        const secondWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        password += secondWord;

        // Capitalize words if uppercase is checked
        if (hasUppercase) {
            password = password.split(/(?=[A-Z])/).map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join('');
        }

        // If the password is still too short, pad it with more characters
        while (password.length < length) {
            const charPool = (hasLowercase ? LOWERCASE : '') +
                             (hasNumbers ? NUMBERS : '') +
                             (hasSymbols ? SYMBOLS : '');
            if (charPool) {
                password += charPool[Math.floor(Math.random() * charPool.length)];
            }
        }

        // If it’s too long, just trim it down to the desired length
        password = password.slice(0, length);

        // Display the final password in the input field
        passwordInput.value = password;

        // Update the strength meter
        updateStrengthMeter(password, { hasUppercase, hasLowercase, hasNumbers, hasSymbols });
    }

    // Helper: shuffles the characters in a string
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // Evaluate how strong the password is and reflect that in the UI
    function updateStrengthMeter(password, options) {
        let score = 0;

        // Longer passwords get higher scores
        score += Math.min(password.length / 4, 3);

        // Add points based on what kinds of characters are used
        if (options.hasUppercase) score++;
        if (options.hasLowercase) score++;
        if (options.hasNumbers) score++;
        if (options.hasSymbols) score++;

        // Set the strength bar style based on total score
        strengthLevel.className = 'strength-level';
        if (score <= 3) {
            strengthLevel.classList.add('weak');
        } else if (score <= 5) {
            strengthLevel.classList.add('medium');
        } else {
            strengthLevel.classList.add('strong');
        }
    }

    // Show a quick notification (success or error)
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Automatically generate a password when the page loads
    generatePassword();
});
