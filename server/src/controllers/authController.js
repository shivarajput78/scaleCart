// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const pool = require("../config/db");



// const crypto = require("crypto");

// const hashToken = (token) => {
//   return crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");
// };


// const isValidEmail = (email) => {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };


// const refreshAccessToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Refresh token required",
//       });
//     }

//     const tokenHash = hashToken(refreshToken);

//     const result = await pool.query(
//       `SELECT
//         rt.id,
//         rt.user_id,
//         rt.expires_at,
//         u.role
//        FROM refresh_tokens rt
//        JOIN users u ON u.id = rt.user_id
//        WHERE rt.token_hash = $1`,
//       [tokenHash]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid refresh token",
//       });
//     }

//     const session = result.rows[0];

//     if (new Date(session.expires_at) < new Date()) {
//       await pool.query(
//         "DELETE FROM refresh_tokens WHERE id = $1",
//         [session.id]
//       );

//       return res.status(401).json({
//         success: false,
//         message: "Refresh token expired",
//       });
//     }

//     const accessToken = jwt.sign(
//       {
//         userId: session.user_id,
//         role: session.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15m",
//       }
//     );

//     res.json({
//       success: true,
//       accessToken,
//     });
//   } catch (error) {
//     console.error("Refresh token error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };




// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Find user
//     const result = await pool.query(
//       `SELECT id, name, email, password_hash, role
//        FROM users
//        WHERE email = $1`,
//       [email.toLowerCase()]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const user = result.rows[0];

//     // Compare password
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user.password_hash
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // =========================
//     // ACCESS TOKEN
//     // =========================

//     const accessToken = jwt.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15m",
//       }
//     );

//     // =========================
//     // REFRESH TOKEN
//     // =========================

//     const refreshToken = crypto.randomBytes(64).toString("hex");

//     // Hash refresh token before storing
//     const refreshTokenHash = hashToken(refreshToken);

//     // Refresh token expires in 7 days
//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + 7);

//     // Save refresh token hash in database
//     await pool.query(
//       `INSERT INTO refresh_tokens
//        (user_id, token_hash, expires_at)
//        VALUES ($1, $2, $3)`,
//       [user.id, refreshTokenHash, expiresAt]
//     );

//     // =========================
//     // RESPONSE
//     // =========================

//     res.json({
//       success: true,
//       message: "Login successful",

//       accessToken,
//       refreshToken,

//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };









// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // 1. validation
//     if (!name || !email || !password) {
//   return res.status(400).json({
//     success: false,
//     message: "Name, email and password are required",
//   });
// }

// const normalizedEmail = email.trim().toLowerCase();
// const normalizedName = name.trim();

// if (!isValidEmail(normalizedEmail)) {
//   return res.status(400).json({
//     success: false,
//     message: "Invalid email format",
//   });
// }

// if (normalizedName.length < 2 || normalizedName.length > 100) {
//   return res.status(400).json({
//     success: false,
//     message: "Name must be between 2 and 100 characters",
//   });
// }

// if (password.length < 8) {
//   return res.status(400).json({
//     success: false,
//     message: "Password must be at least 8 characters",
//   });
// }

//     // 2. Check existing user
//     const existingUser = await pool.query(
//       "SELECT id FROM users WHERE email = $1",
//       [normalizedEmail]
//     );

//     if (existingUser.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // 3. Hash password
//     const passwordHash = await bcrypt.hash(password, 12);

//     // 4. Create user
//     const result = await pool.query(
//       `INSERT INTO users (name, email, password_hash)
//        VALUES ($1, $2, $3)
//        RETURNING id, name, email, role, created_at`,
//       [name, normalizedEmail, passwordHash]
//     );

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Register error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



// module.exports = {
//   register,
//   login,
//   refreshAccessToken,
// };








// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const pool = require("../config/db");
// const crypto = require("crypto");

// const hashToken = (token) => {
//   return crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");
// };

// const isValidEmail = (email) => {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

// const refreshAccessToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Refresh token required",
//       });
//     }

//     const tokenHash = hashToken(refreshToken);

//     const result = await pool.query(
//       `SELECT
//         rt.id,
//         rt.user_id,
//         rt.expires_at,
//         u.role
//        FROM refresh_tokens rt
//        JOIN users u ON u.id = rt.user_id
//        WHERE rt.token_hash = $1`,
//       [tokenHash]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid refresh token",
//       });
//     }

//     const session = result.rows[0];

//     if (new Date(session.expires_at) < new Date()) {
//       await pool.query(
//         "DELETE FROM refresh_tokens WHERE id = $1",
//         [session.id]
//       );

//       return res.status(401).json({
//         success: false,
//         message: "Refresh token expired",
//       });
//     }

//     const accessToken = jwt.sign(
//       {
//         userId: session.user_id,
//         role: session.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15m",
//       }
//     );

//     return res.json({
//       success: true,
//       accessToken,
//     });
//   } catch (error) {
//     console.error("Refresh token error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     if (!isValidEmail(normalizedEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//     }

//     const result = await pool.query(
//       `SELECT id, name, email, password_hash, role
//        FROM users
//        WHERE email = $1`,
//       [normalizedEmail]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const user = result.rows[0];

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user.password_hash
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const accessToken = jwt.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15m",
//       }
//     );

//     const refreshToken = crypto
//       .randomBytes(64)
//       .toString("hex");

//     const refreshTokenHash = hashToken(refreshToken);

//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + 7);

//     await pool.query(
//       `INSERT INTO refresh_tokens
//        (user_id, token_hash, expires_at)
//        VALUES ($1, $2, $3)`,
//       [user.id, refreshTokenHash, expiresAt]
//     );

//     return res.json({
//       success: true,
//       message: "Login successful",

//       accessToken,
//       refreshToken,

//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email and password are required",
//       });
//     }

//     const normalizedName = name.trim();
//     const normalizedEmail = email.trim().toLowerCase();

//     if (!isValidEmail(normalizedEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//     }

//     if (
//       normalizedName.length < 2 ||
//       normalizedName.length > 100
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Name must be between 2 and 100 characters",
//       });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters",
//       });
//     }

//     const existingUser = await pool.query(
//       "SELECT id FROM users WHERE email = $1",
//       [normalizedEmail]
//     );

//     if (existingUser.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     const passwordHash = await bcrypt.hash(password, 12);

//     const result = await pool.query(
//       `INSERT INTO users (name, email, password_hash)
//        VALUES ($1, $2, $3)
//        RETURNING id, name, email, role, created_at`,
//       [
//         normalizedName,
//         normalizedEmail,
//         passwordHash,
//       ]
//     );

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Register error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// module.exports = {
//   register,
//   login,
//   refreshAccessToken,
// };




const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const pool = require("../config/db");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const getRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role, created_at
      `,
      [normalizedName, normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();

    await pool.query(
      `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3)
      `,
      [user.id, tokenHash, expiresAt]
    );

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const client = await pool.connect();

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokenHash = hashToken(refreshToken);

    await client.query("BEGIN");

    /*
     * Lock the refresh-token row.
     *
     * This is important when two refresh requests
     * arrive at almost the same time.
     */
    const result = await client.query(
      `
      SELECT
        rt.id,
        rt.user_id,
        rt.expires_at,
        u.email,
        u.role
      FROM refresh_tokens rt
      JOIN users u
        ON u.id = rt.user_id
      WHERE rt.token_hash = $1
      FOR UPDATE
      `,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const session = result.rows[0];

    /*
     * Check expiry.
     */
    if (new Date(session.expires_at) <= new Date()) {
      await client.query(
        "DELETE FROM refresh_tokens WHERE id = $1",
        [session.id]
      );

      await client.query("COMMIT");

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
      });
    }

    /*
     * Generate a completely new refresh token.
     */
    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);
    const newExpiresAt = getRefreshTokenExpiry();

    /*
     * Delete old token.
     *
     * Therefore the old refresh token can never
     * be used again after successful rotation.
     */
    await client.query(
      "DELETE FROM refresh_tokens WHERE id = $1",
      [session.id]
    );

    /*
     * Store only the hash of the new refresh token.
     */
    await client.query(
      `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3)
      `,
      [
        session.user_id,
        newTokenHash,
        newExpiresAt,
      ]
    );

    /*
     * Create a fresh access token.
     */
    const accessToken = jwt.sign(
      {
        userId: session.user_id,
        email: session.email,
        role: session.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    console.error("Refresh token error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokenHash = hashToken(refreshToken);

    /*
     * Logout is intentionally idempotent.
     *
     * Whether the token exists or was already deleted,
     * the client receives a successful logout response.
     */
    await pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE token_hash = $1
      `,
      [tokenHash]
    );

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};