// DOM Elements
const welcomeMessage = document.getElementById('welcomeMessage');
const contactForm = document.getElementById('contactForm');
const submissionResult = document.getElementById('submissionResult');
const resultName = document.getElementById('resultName');
const resultEmail = document.getElementById('resultEmail');
const resultPhone = document.getElementById('resultPhone');
const resultMessage = document.getElementById('resultMessage');
const resultTimestamp = document.getElementById('resultTimestamp');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Set welcome message with user's name if available
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a stored name in localStorage
    const storedName = localStorage.getItem('userName');
    const userName = storedName || 'Visitor';
    
    // Update welcome message
    welcomeMessage.textContent = `Hi ${userName}!`;
    
    // If no stored name, prompt for name (optional)
    if (!storedName) {
        setTimeout(() => {
            const name = prompt("Welcome to TechVision! What's your name?", "Visitor");
            if (name && name.trim() !== "") {
                localStorage.setItem('userName', name.trim());
                welcomeMessage.textContent = `Hi ${name.trim()}!`;
            }
        }, 1000);
    }
    
    // Set current year in footer (optional enhancement)
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
    
    // Set up mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Set active nav link based on scroll position
    window.addEventListener('scroll', setActiveNavLink);
    
    // Initialize with active nav link
    setActiveNavLink();
});

// Mobile Menu Functions
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Set active navigation link based on scroll position
function setActiveNavLink() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Form Validation and Submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Reset error messages
    resetErrorMessages();
    
    // Validate inputs
    let isValid = true;
    
    // Name validation
    if (name === '') {
        displayError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        displayError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        displayError('emailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        displayError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phone === '') {
        displayError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        displayError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Message validation
    if (message === '') {
        displayError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        displayError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    // If form is valid, show submission result
    if (isValid) {
        displaySubmissionResult(name, email, phone, message);
        // Optional: Store in localStorage
        storeFormData(name, email, phone, message);
        // Optional: Reset form
        contactForm.reset();
        // Scroll to result
        submissionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Helper functions for form validation
function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Highlight the input with error
    const inputId = elementId.replace('Error', '');
    const inputElement = document.getElementById(inputId);
    inputElement.style.borderColor = '#e74c3c';
    inputElement.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
}

function resetErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    // Reset input borders
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.style.borderColor = '#ddd';
        input.style.boxShadow = 'none';
    });
}

// Display submission result
function displaySubmissionResult(name, email, phone, message) {
    // Update result elements
    resultName.textContent = name;
    resultEmail.textContent = email;
    resultPhone.textContent = phone;
    resultMessage.textContent = message;
    
    // Add timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    resultTimestamp.textContent = `Submitted on: ${timestamp}`;
    
    // Show result container with animation
    submissionResult.classList.add('show');
    
    // Add success animation
    submissionResult.style.animation = 'fadeIn 0.5s ease';
    
    // Store the user's name if they entered it in the form
    if (name && name !== 'Visitor') {
        localStorage.setItem('userName', name);
        welcomeMessage.textContent = `Hi ${name}!`;
    }
}

// Store form data in localStorage (optional feature)
function storeFormData(name, email, phone, message) {
    const formData = {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString()
    };
    
    // Get existing submissions or create new array
    const existingData = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    // Add new submission
    existingData.push(formData);
    
    // Keep only last 5 submissions
    if (existingData.length > 5) {
        existingData.shift();
    }
    
    // Save back to localStorage
    localStorage.setItem('formSubmissions', JSON.stringify(existingData));
}

// Optional: Load previous submissions on page load
function loadPreviousSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    if (submissions.length > 0) {
        const latest = submissions[submissions.length - 1];
        resultName.textContent = latest.name;
        resultEmail.textContent = latest.email;
        resultPhone.textContent = latest.phone;
        resultMessage.textContent = latest.message;
        
        const timestamp = new Date(latest.timestamp).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        resultTimestamp.textContent = `Last submitted: ${timestamp}`;
        
        submissionResult.classList.add('show');
    }
}

// Call loadPreviousSubmissions on DOMContentLoaded if you want to show last submission
document.addEventListener('DOMContentLoaded', loadPreviousSubmissions);