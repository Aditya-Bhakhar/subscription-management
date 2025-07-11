// src/data/createTableIfNotExists.ts

import pool from "../db/pool.js";

// Function to update updated_at timestamp
const createUpdatedAtTriggerFunction = async () => {
  const queryText = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
  try {
    await pool.query(queryText);
    console.log("Trigger function created");
  } catch (error) {
    console.log("Error creating trigger function: ", error);
  }
};

const createNotifyNewInvoiceTriggerFunction = async () => {
  const queryText = `
    CREATE OR REPLACE FUNCTION notify_new_invoice() 
    RETURNS TRIGGER AS $$ 
    BEGIN 
      PERFORM pg_notify('new_invoice', row_to_json(NEW)::text);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
  try {
    await pool.query(queryText);
    console.log("Notify new invoice Trigger function created");
  } catch (error) {
    console.log(
      "ERROR: Error creating notify new invoice trigger function: ",
      error
    );
  }
};

const createNotifyNewInvoiceTrigger = async () => {
  const queryText = `
    CREATE OR REPLACE TRIGGER trigger_new_invoice
    AFTER INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_invoice();
  `;
  try {
    await pool.query(queryText);
    console.log("Trigger for notifying new invoices created successfully");
  } catch (error) {
    console.error("ERROR: Could not create invoices trigger:", error);
  }
};

// Users Table
export const createUsersTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    role user_role NOT NULL, 
    profile_picture TEXT,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;
  try {
    await pool.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'finance');
      END IF;
    END $$;`);
    await pool.query(queryText);
    console.log("Users table created successfully");
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for users table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating users table: `, error);
  }
};

// Customers Table
export const createCustomersTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    address TEXT NULL,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Customer table created successfully");
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for customers table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating customers table: `, error);
  }
};

// Subscription Plans Table
export const createSubscriptionPlansTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    features TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Subscription Plans table created successfully");
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_subscription_plans_updated_at
        BEFORE UPDATE ON subscription_plans
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for subscription_plans table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating subscription_plans table: `, error);
  }
};

// Subscriptions Table
export const createSubscriptionsTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    status VARCHAR(25) CHECK (status IN ('pending', 'active', 'suspended', 'expired', 'canceled', 'renewed', 'failed')) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
  )`;
  try {
    await pool.query(queryText);
    console.log("Subscriptions table created successfully");
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_customerId_planId_status_idx 
      ON subscriptions (customer_id, plan_id, status);
    `);
    console.log(
      "Unique index for (customer_id, plan_id, status) created successfully."
    );
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_subscriptions_updated_at
        BEFORE UPDATE ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for subscriptions table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating subscriptions table: `, error);
  }
};

// Expenses Table
export const createExpensesTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_name VARCHAR(50) NOT NULL,
    provider_name VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    status expense_status NOT NULL,
    purchased_date TIMESTAMPTZ NOT NULL CHECK (purchased_date <= NOW()),
    renewal_date TIMESTAMPTZ NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status') THEN
        CREATE TYPE expense_status AS ENUM ('active', 'pending', 'expired', 'canceled');
      END IF;
    END $$;`);
    console.log("ENUM type 'expense_status' checked/created successfully.");
    await pool.query(queryText);
    console.log("Expenses table created successfully");
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_expense_provider_idx 
      ON expenses (LOWER(expense_name), LOWER(provider_name))
    `);
    console.log(
      "Unique index for (LOWER(expense_name), LOWER(provider_name)) created successfully."
    );
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_expenses_updated_at
        BEFORE UPDATE ON expenses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for expenses table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating expenses table: `, error);
  }
};

// Items Table
export const createItemsTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NULL,
    category TEXT NOT NULL CHECK (category IN ('Service', 'Product')),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER CHECK (quantity >= 0), 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Items table created successfully");
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_items_updated_at
        BEFORE UPDATE ON items
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for items table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating items table: `, error);
  }
};

// Subscription Item Table
export const createSubscriptionItemTableIfNotExists = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS subscription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE, 
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Subscription Item table created successfully");
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_subscription_item_idx 
      ON subscription_items (subscription_id, item_id);
    `);
    console.log(
      "Unique index for (subscription_id, item_id) created successfully."
    );
    await pool.query(`
      CREATE OR REPLACE TRIGGER update_subscription_items_updated_at
      BEFORE UPDATE ON subscription_items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column() 
  `);
    console.log(`Triger for subscription_items table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating subscription_item table: `, error);
  }
};

// Invoices Table
export const createInvoicesTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
      plan_name VARCHAR(255) NOT NULL,
      plan_price DECIMAL(10,2) NOT NULL,
      invoice_number VARCHAR(50) UNIQUE NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      items JSONB NOT NULL,
      status invoice_status NOT NULL DEFAULT 'generated',
      issued_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      due_date TIMESTAMPTZ NOT NULL,
      pdf_url TEXT NULL,
      notes TEXT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await pool.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE invoice_status AS ENUM ('pending', 'generated', 'sent', 'paid', 'overdue', 'canceled', 'failed', 'refunded');
      END IF;
    END $$`);
    await pool.query(queryText);
    console.log("Invoices table created successfully");
    await pool.query(`
        CREATE OR REPLACE TRIGGER update_invoices_updated_at
        BEFORE UPDATE ON invoices
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log(`Triger for invoices table created successfully...`);
  } catch (error) {
    console.log(`ERROR: Error creating invoices table: `, error);
  }
};

// User Notifications Tabel
export const createUserNotificationsTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('subscription_expiry', 'new_purchase', 'invoice_failed', 'system_alert')),
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("User Notifications table created successfully");
  } catch (error) {
    console.log(`ERROR: Error creating user_notifications table: `, error);
  }
};

// Customer Notification Table
export const createCustomerNotificationsTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS customer_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('invoice_sent', 'subscription_expiry')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Customer Notifications table created successfully");
  } catch (error) {
    console.log(`ERROR: Error creating customer_notifications table: `, error);
  }
};

// Activity Logs Table
export const createActivityLogsTableIfNotExists = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ DEFAULT NOW()
  )`;
  try {
    await pool.query(queryText);
    console.log("Activity Logs table created successfully");
  } catch (error) {
    console.log(`ERROR: Error creating activity_logs table: `, error);
  }
};

export const createTablesIfNotExists = async () => {
  try {
    await createUpdatedAtTriggerFunction();
    await createNotifyNewInvoiceTriggerFunction();
    await createUsersTableIfNotExists();
    await createCustomersTableIfNotExists();
    await createSubscriptionPlansTableIfNotExists();
    await createSubscriptionsTableIfNotExists();
    await createExpensesTableIfNotExists();
    await createItemsTableIfNotExists();
    await createSubscriptionItemTableIfNotExists();
    await createInvoicesTableIfNotExists();
    await createNotifyNewInvoiceTrigger();
    await createUserNotificationsTableIfNotExists();
    await createCustomerNotificationsTableIfNotExists();
    await createActivityLogsTableIfNotExists();
    console.log("All tables are set up successfully...");
  } catch (error) {
    console.error("ERROR: Error setting up tables if not exists:", error);
  }
};
