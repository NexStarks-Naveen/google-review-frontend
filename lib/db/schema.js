
import { integer, pgTable, varchar, date, boolean, text } from "drizzle-orm/pg-core";

const adminsTable = pgTable("tbl_admin_master", {
    user_id: varchar().primaryKey(),
    email: varchar({ length: 255 }).notNull(),
    user_password: varchar({ length: 255 }).notNull(),
    created_at: date(),
    updated_at: date(),
    is_active: boolean().default(false),
    is_deleted: boolean().default(true),
    is_admin: boolean().default(false)
});
const customerTable = pgTable("tbl_customer_master", {
    user_id: varchar().primaryKey(),
    email: varchar({ length: 255 }).notNull(),
    user_password: varchar({ length: 255 }).notNull(),
    created_at: date(),
    updated_at: date(),
    is_active: boolean().default(false),
    is_deleted: boolean().default(true),
    company_name: varchar(),
    img_url: varchar(),
    google_review_url: varchar(),
    description: text(),
    review_page_url: varchar(),
    address: varchar(),
    phone_number: varchar()
});

const reviewTable = pgTable("tbl_review_master", {
    review_id: varchar().primaryKey(),
    user_id: varchar(),
    review: text(),
    rating: integer(),
    created_at: date(),
    phone_number: varchar(),
    name: varchar(),
    is_deleted: boolean().default(true),
});
export {
    adminsTable,
    customerTable,
    reviewTable
}
