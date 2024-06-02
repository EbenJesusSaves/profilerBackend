import { comparePassword, createJWTToken, hashPassword } from "../auth/auth";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.connectionString,
});

export const signUp = async (req, res) => {
  const { username, password, email, id, profile } = req.body;
  const ps = await hashPassword(password);

  try {
    const { rows } = await pool.query(
      `
        INSERT INTO userprofile
        (
            username,
            email,
            profile,
            password
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *
        ;
    `,
      [username, email, profile, ps]
    );
    const token = createJWTToken(rows[0]);
    res.status(200).json({
      data: {
        username: rows[0].username,
        email: rows[0].email,
        profile: rows[0].profile,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      ` SELECT * FROM userprofile WHERE username =$1;`,
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
