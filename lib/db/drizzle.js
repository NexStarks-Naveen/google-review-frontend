'use server'

import { drizzle } from 'drizzle-orm/neon-serverless';
// import { neon } from '@neondatabase/serverless'; // Import the Neon client
import { adminsTable, reviewTable, customerTable } from './schema';
import 'dotenv/config';
import { eq, and, or } from 'drizzle-orm';

// Pass the Neon client to Drizzle
const db = drizzle(process.env.DATABASE_URL);
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


export { getAdmins, getReviews, getCustomerData };
