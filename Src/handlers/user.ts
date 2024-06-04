import * as dotenv from "dotenv";
import { comparePassword, createJWTToken, hashPassword } from "../auth/auth";
import pg from "pg";
import { validationResult } from "express-validator";
import { checker } from "../middlewares/authChecks";
dotenv.config();
export const pool = new pg.Pool({
  connectionString: process.env.connectionString,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log("Connected successfully", res.rows[0]);
  }
});
export const signUp = async (req, res) => {
  checker(req, res);

  const { username, password, email } = req.body;
  const ps = await hashPassword(password);
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO users
    (
        email,
        username,
        password
    )
    VALUES
    (
        $1,
        $2,
        $3
    )
    RETURNING *
    ;
`,
      [email, username, ps]
    );

    const token = createJWTToken(rows[0]);

    res.status(200).json({
      data: {
        username: rows[0].username,
        email: rows[0].email,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

export const signIn = async (req, res, next) => {
  checker(req, res);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE username =$1;`,
      [req.body.username]
    );

    if (!rows.length)
      return res.status(401).json({ message: "wrong username or password" });

    const isValid = await comparePassword(req.body.password, rows[0].password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "wrong username or password" });
    }

    const token = createJWTToken(rows[0]);
    res.json({
      data: {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email,
        profile: rows[0].profile,
        token,
      },
    });
  } catch (error) {}
};
