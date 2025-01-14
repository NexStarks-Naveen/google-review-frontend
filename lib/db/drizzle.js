'use server'

import { drizzle } from 'drizzle-orm/neon-serverless';
// import { neon } from '@neondatabase/serverless'; // Import the Neon client
import { adminsTable, reviewTable, customerTable } from './schema';
import 'dotenv/config';
import { eq, and, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Pass the Neon client to Drizzle
const db = drizzle(process.env.DATABASE_URL);

const generateCustomUUID = (series) => {
    const uuid = uuidv4(); // Generate a standard UUID
    return `${series}-${uuid}`;    // Prepend 'R-' to the UUID
};

const getAdmins = (userAgent) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the database
            const admins = await db
                .select(adminsTable)
                .from(adminsTable)
                .where(
                    and(
                        eq(adminsTable.email, userAgent.email),
                        eq(adminsTable.user_password, userAgent.password)
                    )
                );
            resolve(admins); // Resolve the promise with fetched data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
};

const getReviews = (user_id) => {
    console.log("inside of get ", user_id);
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the database
            const data = await db.select().from(reviewTable)
                .where(
                    eq(reviewTable.user_id, user_id)
                );
            resolve(data); // Resolve the promise with fetched data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
};

const getCustomerData = (user) => {
    console.log("inside of get ", user);
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the database
            const data = await db.select().from(customerTable)
                .where(
                    and(eq(customerTable.user_id, user.user_id), eq(customerTable.email, user.email))
                );
            resolve(data); // Resolve the promise with fetched data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
};

const getCustomerForReview = (user_id) => {
    console.log("inside of get ", user_id);
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the database
            const data = await db.select().from(customerTable)
                .where(
                    eq(customerTable.user_id, user_id)
                );
            resolve(data); // Resolve the promise with fetched data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
};

const getCustomers = () => {
    console.log("inside of get ");
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch data from the database
            const data = await db.select().from(customerTable)
            resolve(data); // Resolve the promise with fetched data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
};

const insertReview = async (review) => {
    const uuidValue = generateCustomUUID('R'); // Generate a custom UUID
    const currentDate = new Date();

    // Add required fields to the review object
    review["review_id"] = uuidValue;
    review["created_at"] = currentDate.toISOString(); // Use ISO format for the full date
    review["is_deleted"] = false;

    console.log("Review before insertion:", review);

    try {
        // Insert the review into the database and return the result
        const data = await db.insert(reviewTable).values(review).returning();
        return data; // Return the inserted data
    } catch (error) {
        console.error("Error inserting review:", error);
        throw error; // Throw the error for further handling
    }
};

const addCustomer = async (customer) => {
    const uuidValue = generateCustomUUID('G'); // Generate a custom UUID
    const currentDate = new Date();

    // Add required fields to the review object
    customer["user_id"] = uuidValue;
    customer["created_at"] = currentDate.toISOString(); // Use ISO format for the full date
    customer["is_deleted"] = false;
    customer["is_active"] = true;
    customer["updated_at"] = currentDate.toISOString();
    customer["review_page_url"] = `${process.env.PAGE_URL}/review/${uuidValue}`
    console.log("customer before insertion:", customer);
    try {
        // Insert the review into the database and return the result
        const existingCustomer = await db
            .select()
            .from(customerTable)
            .where(eq(customerTable.email, customer.email));

        if (existingCustomer.length > 0) {
            console.log("Email already exists");
            return { message: "Email already exists", response: {} };
        }
        const customer_response = await db.insert(customerTable).values(customer).returning();
        const user_data = {
            user_id: customer.user_id,
            email: customer.email,
            user_password: customer.user_password,
            is_active: customer.is_active,
            is_deleted: customer.is_deleted,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            is_admin: false
        }
        const admin_response = await db.insert(adminsTable).values(user_data).returning();
        return { message: "Customer added successfully", response: { customer_response, admin_response } }; // Return the inserted data
    } catch (error) {
        console.error("Error inserting review:", error);
        throw error; // Throw the error for further handling
    }
};


export { getAdmins, getReviews, getCustomerData, getCustomerForReview, insertReview, getCustomers, addCustomer };
