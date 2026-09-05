const pool = require("../config/db");

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT *
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      addresses: result.rows,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

















const addAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required address fields are missing",
      });
    }

    await client.query("BEGIN");

    // If this becomes default,
    // remove default from previous address.
    if (isDefault === true) {
      await client.query(
        `
        UPDATE addresses
        SET
          is_default = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        `,
        [userId]
      );
    }

    const result = await client.query(
      `
      INSERT INTO addresses (
        user_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
      RETURNING *
      `,
      [
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2 || null,
        city,
        state,
        postalCode,
        country || "India",
        isDefault === true,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Add address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  } finally {
    client.release();
  }
};











const updateAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    await client.query("BEGIN");

    const existing = await client.query(
      `
      SELECT id
      FROM addresses
      WHERE id = $1
        AND user_id = $2
      FOR UPDATE
      `,
      [id, userId]
    );

    if (existing.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (isDefault === true) {
      await client.query(
        `
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = $1
        `,
        [userId]
      );
    }

    const result = await client.query(
      `
      UPDATE addresses
      SET
        full_name = COALESCE($1, full_name),
        phone = COALESCE($2, phone),
        address_line1 = COALESCE($3, address_line1),
        address_line2 = COALESCE($4, address_line2),
        city = COALESCE($5, city),
        state = COALESCE($6, state),
        postal_code = COALESCE($7, postal_code),
        country = COALESCE($8, country),
        is_default = COALESCE($9, is_default),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
        AND user_id = $11
      RETURNING *
      `,
      [
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,
        id,
        userId,
      ]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  } finally {
    client.release();
  }
};











const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM addresses
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};










module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};