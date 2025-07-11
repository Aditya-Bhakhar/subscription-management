// src/models/assignSubscriptionModel.ts

import pool from "../db/pool.js";
import { generateInvoiceNumber } from "../services/assignSubscriptionService.js";
import { AssignSubscription } from "../types/AssignSubscription.js";
import { Invoice } from "../types/Invoice.js";

export const createAssignSubscriptionModel = async (
  assign_subscription: AssignSubscription
): Promise<{
  success: boolean;
  subscription: AssignSubscription;
  invoice?: Invoice;
}> => {
  try {
    await pool.query("BEGIN");
    const insertSubscriptionQuery = `
          INSERT INTO subscriptions (customer_id, plan_id, status, start_date, end_date, auto_renew)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
      `;
    const insertSubscriptionValues = [
      assign_subscription.customer_id,
      assign_subscription.plan_id,
      assign_subscription.status,
      assign_subscription.start_date,
      assign_subscription.end_date,
      assign_subscription.auto_renew,
    ];
    const { rows: subscriptionRows } = await pool.query(
      insertSubscriptionQuery,
      insertSubscriptionValues
    );
    const subscriptionResult = subscriptionRows[0];

    if (assign_subscription.items.length > 0) {
      const item_ids = assign_subscription.items.map((item) => item.item_id);
      const item_quantities = assign_subscription.items.map(
        (item) => item.quantity
      );
      const insertItemsQuery = `
        INSERT INTO subscription_items (subscription_id, item_id, quantity) 
        SELECT $1, unnest($2::uuid[]), unnest($3::int[])
        RETURNING *
      `;
      const insertItemsValues = [
        subscriptionResult.id,
        item_ids,
        item_quantities,
      ];
      const { rows: itemRows } = await pool.query(
        insertItemsQuery,
        insertItemsValues
      );
    }
    const invoiceQuery = `
        SELECT 
          s.id AS subscription_id,
          s.customer_id, 
          c.firstname || ' ' || c.lastname AS customer_name, 
          c.email AS customer_email, 
          s.plan_id, 
          p.name AS plan_name, 
          p.price AS plan_price,
          p.price AS total_amount,
          COALESCE(
            JSON_AGG(
              JSONB_BUILD_OBJECT(
                'item_id', si.item_id,
                'item_name', i.name,
                'quantity', si.quantity,
                'price_per_unit', i.price
              )
            ) FILTER (WHERE si.item_id IS NOT NULL), '[]'::json
          ) AS items
        FROM subscriptions s
        JOIN customers c ON s.customer_id = c.id
        JOIN subscription_plans p ON s.plan_id = p.id
        LEFT JOIN subscription_items si ON s.id = si.subscription_id
        LEFT JOIN items i ON si.item_id = i.id
        WHERE s.id = $1
        GROUP BY s.id, c.id, p.id;
      `;
    const { rows: invoiceValues } = await pool.query(invoiceQuery, [
      subscriptionResult.id,
    ]);
    const invoiceData = invoiceValues[0];
    if (!invoiceData) {
      throw new Error("Failed to fetch subscription details for invoices!");
    }
    const itemsJson = JSON.stringify(invoiceData.items);
    const invoiceNumber = await generateInvoiceNumber();
    const insert_invoice_query = `
        INSERT INTO invoices (customer_id, customer_name, customer_email, 
          subscription_id, plan_name, plan_price, invoice_number, 
          total_amount, items, status, issued_date, due_date, pdf_url, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'generated', 
          NOW(), NOW() + INTERVAL '30 days', $10, $11)
        RETURNING *;
      `;
    const insert_invoice_values = [
      invoiceData.customer_id,
      invoiceData.customer_name,
      invoiceData.customer_email,
      invoiceData.subscription_id,
      invoiceData.plan_name,
      invoiceData.plan_price,
      invoiceNumber,
      invoiceData.total_amount,
      itemsJson,
      invoiceData.pdf_url,
      invoiceData.notes,
    ];
    const { rows: invoiceRowsResult } = await pool.query(
      insert_invoice_query,
      insert_invoice_values
    );
    console.log(
      "SUCCESS: Created subscription & generated invoice (model): ",
      subscriptionResult,
      invoiceRowsResult
    );

    const invoiceResult = invoiceRowsResult[0];

    await pool.query("COMMIT");
    return {
      success: true,
      subscription: subscriptionResult,
      invoice: invoiceResult,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(
      "ERROR: Failed to assign subscription & generate invoice (model): ",
      error
    );
    throw error;
  }
};

export const getAllAssignedSubscriptionsModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{
  subscriptions: AssignSubscription[];
  totalSubscriptions: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "customer_name",
      "plan_name",
      "status",
      "start_date",
      "end_date",
      "auto_renew",
      "created_at",
      "updated_at",
    ];
    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "updated_at";
    const sortOrder = validOrders.includes(order.toLowerCase())
      ? order
      : "desc";

    const select_query = `
      SELECT 
        s.id,
        json_build_object(
          'customer_id', c.id,
          'customer_name', c.firstname || ' ' || c.lastname
        ) AS customer,
        json_build_object(
          'plan_id', sp.id,
          'plan_name', sp.name
        ) AS plan,
        s.status,
        s.start_date,
        s.end_date,
        s.auto_renew,
        s.created_at,
        s.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', si.item_id,
              'item_name', i.name,
              'quantity', si.quantity
            )
          ) FILTER (WHERE si.item_id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM subscriptions s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      LEFT JOIN subscription_items si ON s.id = si.subscription_id
      LEFT JOIN items i ON si.item_id = i.id
      GROUP BY s.id, c.id, c.firstname, c.lastname, sp.id, sp.name
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $1 OFFSET $2;
    `;

    const { rows: subscriptions } = await pool.query(select_query, [
      limit,
      offset,
    ]);

    const countQuery = `SELECT count(*) FROM subscriptions`;
    const { rows } = await pool.query(countQuery);
    const totalSubscriptions = parseInt(rows[0].count, 10);

    return { subscriptions, totalSubscriptions };
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch all assigned subscriptions (model): ",
      error
    );
    throw error;
  }
};

export const getAssignedSubscriptionByIdModel = async (
  id: string
): Promise<AssignSubscription | null> => {
  try {
    const select_query = `
    SELECT asub.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'item_id', ai.item_id, 
            'quantity', ai.quantity
          )
        ) FILTER (WHERE ai.item_id IS NOT NULL), 
        '[]'::json
      ) AS items
    FROM subscriptions asub
    LEFT JOIN subscription_items ai ON asub.id = ai.subscription_id
    WHERE asub.id = $1
    GROUP BY asub.id;
  `;
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to get assigned subscription by id: ", error);
    throw error;
  }
};

export const getAssignedSubscriptionByCustAndPlanIdModel = async (
  customer_id: string,
  plan_id: string
): Promise<AssignSubscription | null> => {
  try {
    const select_query = `
    SELECT s.*, 
      COALESCE(
        json_agg(
          json_build_object( 
            'item_id', si.item_id, 
            'quantity', si.quantity
          )
        ) FILTER (WHERE si.id IS NOT NULL), 
        '[]'
      ) AS items
    FROM subscriptions s
    LEFT JOIN subscription_items si ON s.id = si.subscription_id
    WHERE s.customer_id = $1 AND s.plan_id = $2
    GROUP BY s.id
    LIMIT 1;
  `;
    const { rows } = await pool.query(select_query, [customer_id, plan_id]);
    return rows[0] || null;
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscription by customer_id and plan_id:",
      error
    );
    throw error;
  }
};

export const getAssignedSubscriptionsByCustomerIdModel = async (
  customer_id: string
): Promise<AssignSubscription[]> => {
  try {
    const select_query = `
      SELECT sub.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', si.item_id, 
              'quantity', si.quantity
            )
          ) FILTER (WHERE si.item_id IS NOT NULL), 
          '[]'::json
        ) AS items
      FROM subscriptions sub
      LEFT JOIN subscription_items si ON sub.id = si.subscription_id
      WHERE sub.customer_id = $1
      GROUP BY sub.id;
    `;
    const { rows } = await pool.query(select_query, [customer_id]);
    return rows;
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscriptions by customer_id:",
      error
    );
    throw error;
  }
};

export const getAssignedSubscriptionsByPlanIdModel = async (
  plan_id: string
): Promise<AssignSubscription[]> => {
  try {
    const select_query = `
      SELECT sub.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', si.item_id, 
              'quantity', si.quantity
            )
          ) FILTER (WHERE si.item_id IS NOT NULL), 
          '[]'::json
        ) AS items
      FROM subscriptions sub
      LEFT JOIN subscription_items si ON sub.id = si.subscription_id
      WHERE sub.plan_id = $1
      GROUP BY sub.id;
    `;
    const { rows } = await pool.query(select_query, [plan_id]);
    return rows;
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscriptions by plan_id:",
      error
    );
    throw error;
  }
};

// export const getAllAssignedSubscriptionsWithDetailsModel = async (
//   page: number,
//   limit: number,
//   sortBy: string,
//   order: string
// ) => {
//   try {
//     const offset = (page - 1) * limit;

//   } catch (error) {
//     console.error(
//       "ERROR: Failed to fetch all assigned subscriptions with names model: ",
//       error
//     );
//     throw error;
//   }
// };

export const putUpdateAssignedSubscriptionByIdModel = async (
  id: string,
  updates: AssignSubscription
): Promise<AssignSubscription | null> => {
  try {
    await pool.query("BEGIN");
    const update_subscription_query = `
      UPDATE subscriptions 
      SET customer_id = $1, plan_id = $2, status = $3, start_date = $4, 
          end_date = $5, auto_renew = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const subscription_values = [
      updates.customer_id,
      updates.plan_id,
      updates.status,
      updates.start_date,
      updates.end_date,
      updates.auto_renew,
      id,
    ];
    console.log("Query:", update_subscription_query);
    console.log("Values:", subscription_values);
    const { rows } = await pool.query(
      update_subscription_query,
      subscription_values
    );

    const delete_items_query = `
      DELETE FROM subscription_items WHERE subscription_id = $1;
    `;
    await pool.query(delete_items_query, [id]);

    if (updates.items && updates.items.length > 0) {
      const insert_items_query = `
      INSERT INTO subscription_items (subscription_id, item_id, quantity)
      VALUES ${updates.items
        .map(
          (_, i) =>
            `($${i * 3 + 1}::UUID, $${i * 3 + 2}::UUID, $${i * 3 + 3}::INTEGER)`
        )
        .join(", ")}
    `;
      const item_values = updates.items.flatMap((item) => [
        id,
        item.item_id,
        item.quantity,
      ]);
      console.log("Final Query:", insert_items_query);
      console.log("Query Values:", item_values);
      await pool.query(insert_items_query, item_values);
    }
    await pool.query("COMMIT");

    const updatedSubscription = await getAssignedSubscriptionByIdModel(id);
    return updatedSubscription;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(
      "ERROR: Failed to update assigned subscription (PUT):",
      error
    );
    throw error;
  }
};

export const patchUpdateAssignedSubscriptionByIdModel = async (
  id: string,
  updates: Partial<AssignSubscription>
): Promise<{
  success: boolean;
  subscription: AssignSubscription | null;
  invoice?: Invoice;
}> => {
  try {
    await pool.query("BEGIN");
    // Step 1: Update the subscriptions table
    // Step 5: Update the subscription table with new values
    const subscriptionUpdateQuery = `
      UPDATE subscriptions 
      SET 
        customer_id = COALESCE($1, customer_id), 
        plan_id = COALESCE($2, plan_id), 
        status = COALESCE($3, status), 
        start_date = COALESCE($4, start_date), 
        end_date = COALESCE($5, end_date), 
        auto_renew = COALESCE($6, auto_renew), 
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const subscriptionValues = [
      updates.customer_id || null,
      updates.plan_id || null,
      updates.status || null,
      updates.start_date || null,
      updates.end_date || null,
      updates.auto_renew !== undefined ? updates.auto_renew : null,
      id,
    ];

    const { rows: updatedSubscription } = await pool.query(
      subscriptionUpdateQuery,
      subscriptionValues
    );
    // Step 6: Update subscription items if provided
    if (updates.items && updates.items.length > 0) {
      // Delete existing items for this subscription
      const deleteItemsQuery = `DELETE FROM subscription_items WHERE subscription_id = $1;`;
      await pool.query(deleteItemsQuery, [id]);

      // Insert new items
      const insertItemsQuery = `
        INSERT INTO subscription_items (subscription_id, item_id, quantity) 
        VALUES ${updates.items
          .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
          .join(", ")}
      `;
      const insertValues = [
        id,
        ...updates.items.flatMap(({ item_id, quantity }) => [
          item_id,
          quantity,
        ]),
      ];
      await pool.query(insertItemsQuery, insertValues);
    }

    //  Invoice queries
    const currentSubscriptionQuery = `
      SELECT 
        s.id,
        json_build_object(
          'customer_id', c.id,
          'customer_name', c.firstname || ' ' || c.lastname
        ) AS customer,
        json_build_object(
          'plan_id', sp.id,
          'plan_name', sp.name
        ) AS plan,
        s.status,
        s.start_date,
        s.end_date,
        s.auto_renew,
        s.created_at,
        s.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', si.item_id,
              'item_name', i.name,
              'quantity', si.quantity
            )
          ) FILTER (WHERE si.item_id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM subscriptions s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      LEFT JOIN subscription_items si ON s.id = si.subscription_id
      LEFT JOIN items i ON si.item_id = i.id
      WHERE s.id = $1
      GROUP BY s.id, c.id, sp.id
    `;
    const { rows: currentSubscription } = await pool.query(
      currentSubscriptionQuery,
      [id]
    );
    const currentSubscriptionData = currentSubscription[0];
    // Step 2: Check for changes in customer_id, plan_id, or items
    let isChanged = false;
    console.log(
      "Currrent Item: ",
      JSON.stringify(currentSubscriptionData.items)
    );
    console.log("Updates Item: ", JSON.stringify(updates.items));
    console.log(currentSubscriptionData);

    type SubscriptionItem = {
      item_id: string;
      item_name?: string;
      quantity: number;
    };
    const normalizedCurrentItems = (currentSubscriptionData.items || []).map(
      (item: SubscriptionItem) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      })
    );

    if (
      (updates.customer_id &&
        updates.customer_id !== currentSubscriptionData.customer_id) ||
      (updates.plan_id &&
        updates.plan_id !== currentSubscriptionData.plan_id) ||
      (updates.items &&
        JSON.stringify(updates.items) !==
          JSON.stringify(normalizedCurrentItems))
    ) {
      isChanged = true;
    }
    // Step 3: If changes are detected, update the invoice status to 'canceled' and create a new invoice
    if (isChanged) {
      const cancelInvoiceQuery = `
        UPDATE invoices
        SET status = 'canceled', updated_at = NOW()
        WHERE subscription_id = $1 AND status IN ('generated');
      `;
      await pool.query(cancelInvoiceQuery, [id]);
    }
    // Step 4: Generate a new invoice based on the updated subscription data
    const invoiceQuery = `
      SELECT 
        s.id AS subscription_id,
        s.customer_id, 
        c.firstname || ' ' || c.lastname AS customer_name, 
        c.email AS customer_email, 
        s.plan_id, 
        p.name AS plan_name, 
        p.price AS plan_price,
        p.price AS total_amount,
        COALESCE(
          JSON_AGG(
            JSONB_BUILD_OBJECT(
              'item_id', si.item_id,
              'item_name', i.name,
              'quantity', si.quantity,
              'price_per_unit', i.price
            )
          ) FILTER (WHERE si.item_id IS NOT NULL), '[]'::json
        ) AS items
      FROM subscriptions s
      JOIN customers c ON s.customer_id = c.id
      JOIN subscription_plans p ON s.plan_id = p.id
      LEFT JOIN subscription_items si ON s.id = si.subscription_id
      LEFT JOIN items i ON si.item_id = i.id
      WHERE s.id = $1
      GROUP BY s.id, c.id, p.id;
    `;
    const invoiceData = await pool.query(invoiceQuery, [id]);
    const itemsJson = JSON.stringify(invoiceData.rows[0].items);
    const invoiceNumber = await generateInvoiceNumber();
    const newInvoiceQuery = `
        INSERT INTO invoices (customer_id, customer_name, customer_email, 
          subscription_id, plan_name, plan_price, invoice_number, 
          total_amount, items, status, issued_date, due_date, pdf_url, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'generated', 
          NOW(), NOW() + INTERVAL '30 days', $10, $11)
        RETURNING *;
      `;
    const newInvoiceValues = [
      invoiceData.rows[0].customer_id,
      invoiceData.rows[0].customer_name,
      invoiceData.rows[0].customer_email,
      invoiceData.rows[0].subscription_id,
      invoiceData.rows[0].plan_name,
      invoiceData.rows[0].plan_price,
      invoiceNumber,
      invoiceData.rows[0].total_amount,
      itemsJson,
      invoiceData.rows[0].pdf_url,
      invoiceData.rows[0].notes,
    ];
    const { rows: newInvoice } = await pool.query(
      newInvoiceQuery,
      newInvoiceValues
    );
    const newInvoiceRes = newInvoice[0];
    console.log("New invoice generated:", newInvoice);

    await pool.query("COMMIT");

    const updatedSubscriptionData = await getAssignedSubscriptionByIdModel(id);
    return {
      success: true,
      subscription: updatedSubscriptionData,
      invoice: newInvoiceRes,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(
      "ERROR: Failed to update assigned subscription (PATCH):",
      error
    );
    throw error;
  }
};

export const deleteAssignedSubscriptionByIdModel = async (
  id: string
): Promise<AssignSubscription> => {
  try {
    const deleteQuery = `
      DELETE FROM subscriptions WHERE id = $1 RETURNING *;
    `;
    const { rows } = await pool.query(deleteQuery, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to delete assigned subscription:", error);
    throw error;
  }
};
