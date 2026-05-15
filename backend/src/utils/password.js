import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async(password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password
export const comparePassword = async(password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};