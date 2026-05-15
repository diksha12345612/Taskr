// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Name validation
export const isValidName = (name) => {
    return name && name.trim().length >= 2;
};

// Role validation
export const isValidRole = (role) => {
    const validRoles = ['Admin', 'Member'];
    return validRoles.includes(role);
};

// Task status validation
export const isValidTaskStatus = (status) => {
    const validStatuses = ['Todo', 'In Progress', 'Done'];
    return validStatuses.includes(status);
};

// Project status validation
export const isValidProjectStatus = (status) => {
    const validStatuses = ['Active', 'Review', 'Hold', 'Completed'];
    return validStatuses.includes(status);
};

// Priority validation
export const isValidPriority = (priority) => {
    const validPriorities = ['High', 'Medium', 'Low'];
    return validPriorities.includes(priority);
};