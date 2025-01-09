document.addEventListener('DOMContentLoaded', function() {
    // Set default date to December 1st, 1992
    const dateInput = document.getElementById('birthDate');
    const targetAgeInput = document.getElementById('targetAge');
    dateInput.value = '1992-12-01';

    // Add modal event listeners
    const modal = document.getElementById('ageModal');
    const pastAgeModal = document.getElementById('pastAgeModal');
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
            hidePastAgeModal();
        }
    });

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    pastAgeModal.addEventListener('click', function(e) {
        if (e.target === pastAgeModal) {
            hidePastAgeModal();
        }
    });

    // Close on X button click
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            hideModal();
            hidePastAgeModal();
        });
    });

    // Handle Enter key on target age input
    targetAgeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('lifeForm').dispatchEvent(new Event('submit'));
        }
    });
});

let countdownInterval;

function updateCountdown(targetDate) {
    clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = targetDate - now;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('hoursLeft').textContent = '00';
            document.getElementById('minutesLeft').textContent = '00';
            document.getElementById('secondsLeft').textContent = '00';
            return;
        }
        
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('hoursLeft').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutesLeft').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('secondsLeft').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

function showModal() {
    const modal = document.getElementById('ageModal');
    modal.classList.add('show');
    // Disable inputs
    document.getElementById('targetAge').disabled = true;
    document.getElementById('birthDate').disabled = true;
}

function hideModal() {
    const modal = document.getElementById('ageModal');
    modal.classList.remove('show');
    // Enable inputs
    document.getElementById('targetAge').disabled = false;
    document.getElementById('birthDate').disabled = false;
}

function showPastAgeModal() {
    const modal = document.getElementById('pastAgeModal');
    modal.classList.add('show');
    // Disable inputs
    document.getElementById('targetAge').disabled = true;
    document.getElementById('birthDate').disabled = true;
}

function hidePastAgeModal() {
    const modal = document.getElementById('pastAgeModal');
    modal.classList.remove('show');
    // Enable inputs
    document.getElementById('targetAge').disabled = false;
    document.getElementById('birthDate').disabled = false;
}

// Array of loader messages
const loaderMessages = [
    "Counting every precious moment of your life... 🎯",
    "Time flies, but we're counting it anyway... ⏰",
    "Doing some time-travel math... 🚀",
    "Calculating your life's pixels... 🖥️",
    "Making every day count... literally! 📅",
    "Crunching numbers faster than time itself... ⚡"
];

let messageInterval;

function startLoaderMessages() {
    const loaderText = document.getElementById('loader').querySelector('.loader-text');
    let availableMessages = [...loaderMessages]; // Create a copy of the messages array
    
    // Function to get a random message and remove it from available messages
    function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * availableMessages.length);
        const message = availableMessages[randomIndex];
        availableMessages.splice(randomIndex, 1);
        
        // If we've used all messages, refill the available messages
        if (availableMessages.length === 0) {
            availableMessages = [...loaderMessages];
        }
        
        return message;
    }
    
    // Set initial message
    loaderText.textContent = getRandomMessage();
    
    // Start cycling messages every 1.5 seconds
    messageInterval = setInterval(() => {
        loaderText.textContent = getRandomMessage();
    }, 1500);
}

function stopLoaderMessages() {
    if (messageInterval) {
        clearInterval(messageInterval);
    }
}

document.getElementById('lifeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loader immediately
    const loader = document.getElementById('loader');
    loader.classList.add('show');
    startLoaderMessages();
    
    // Delay the heavy computation slightly to allow message cycling to start
    setTimeout(() => {
        const birthDateStr = document.getElementById('birthDate').value;
        const [year, month, day] = birthDateStr.split('-');
        const birthDate = new Date(year, month - 1, day);
        
        const targetAge = parseInt(document.getElementById('targetAge').value);
        const today = new Date();
        
        // Calculate current age
        const currentAge = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 365));
        // Set minimum target age to current age + 1
        const minimumAge = currentAge + 1;
        
        if (targetAge > 150) {
            loader.classList.remove('show');
            stopLoaderMessages();
            showModal();
            document.getElementById('targetAge').value = '150';
            return;
        }

        if (targetAge <= currentAge) {
            loader.classList.remove('show');
            stopLoaderMessages();
            showPastAgeModal();
            document.getElementById('targetAge').value = minimumAge.toString();
            return;
        }

        // Start the heavy computation
        const targetDate = new Date(birthDate);
        targetDate.setFullYear(birthDate.getFullYear() + targetAge);
        
        const daysSinceBirth = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        const totalDays = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24));
        const daysLeft = totalDays - daysSinceBirth;
        
        // Calculate time units passed
        const yearsPassed = Math.floor(daysSinceBirth / 365);
        const monthsPassed = Math.floor(daysSinceBirth / 30);
        const weeksPassed = Math.floor(daysSinceBirth / 7);
        
        // Calculate time units left
        const yearsLeft = Math.floor(daysLeft / 365);
        const monthsLeft = Math.floor(daysLeft / 30);
        const weeksLeft = Math.floor(daysLeft / 7);
        
        // Update stats display for both passed and remaining time
        document.getElementById('yearsPassed').textContent = yearsPassed.toLocaleString();
        document.getElementById('monthsPassed').textContent = monthsPassed.toLocaleString();
        document.getElementById('weeksPassed').textContent = weeksPassed.toLocaleString();
        document.getElementById('daysPassed').textContent = daysSinceBirth.toLocaleString();
        
        document.getElementById('yearsLeft').textContent = yearsLeft.toLocaleString();
        document.getElementById('monthsLeft').textContent = monthsLeft.toLocaleString();
        document.getElementById('weeksLeft').textContent = weeksLeft.toLocaleString();
        document.getElementById('daysLeft').textContent = daysLeft.toLocaleString();
        
        // Start the countdown
        updateCountdown(targetDate);
        
        const lifeGrid = document.getElementById('lifeGrid');
        // Clear the grid (including the skull)
        let gridHTML = '';
        
        for (let i = 0; i < totalDays; i++) {
            let classes = 'day-square';
            
            if (i < daysSinceBirth) {
                classes += ' lived';
            } else {
                classes += ' remaining';
            }
            
            gridHTML += `<div class="${classes}" title="Day ${i + 1}"></div>`;
        }
        
        lifeGrid.innerHTML = gridHTML;

        // Hide loader after everything is done
        loader.classList.remove('show');
        stopLoaderMessages();
    }, 100); // Small delay to ensure loader and messages start first
});

// End of form submit handler 