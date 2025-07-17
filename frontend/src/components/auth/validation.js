// validation.js

import { toast } from "sonner";


// Email Validation
export const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

// Phone Number Validation (10 digits, only numbers)
export const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10}$/; // Exactly 10 digits
    return phonePattern.test(phoneNumber);
};

// Name Validation (Only letters and spaces, non-empty)
export const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/; // Only letters and spaces
    return namePattern.test(name);
};

// Password Validation (At least 8 characters, includes uppercase, lowercase, digit, and special character)
export const validatePassword = (password) => {
    const lengthPattern = /^.{8,}$/; // Minimum 8 characters

    return lengthPattern.test(password)
};

// Notify user function
export const notify = (type, message) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        default:
            toast.info(message);
    }
};