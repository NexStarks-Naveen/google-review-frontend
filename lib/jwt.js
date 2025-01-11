'use server'

import jwt from "jsonwebtoken";
import 'dotenv/config';

// Function to generate a JWT token
const generateToken = async (payload, expiresIn = "1h") => {
    const SECRET_KEY = process.env.JWT_SECRET; // Ensure the secret key is set in your environment variables
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign(payload, SECRET_KEY, { expiresIn }, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
        return token; // Return the generated token
    } catch (error) {
        throw new Error(`Failed to generate token: ${error.message}`);
    }
};

// Function to validate a JWT token
const validateToken = async (token) => {
    const SECRET_KEY = process.env.JWT_SECRET; // Ensure the secret key is set in your environment variables
    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        return { valid: true, decoded }; // Return the decoded payload
    } catch (error) {
        return { valid: false, error: error.message }; // Return an invalid result with the error message
    }
};


export { generateToken, validateToken };