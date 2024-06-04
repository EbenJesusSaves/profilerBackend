import { pool } from "./user";

export const postContent = async (req, res, next) => {
  const { title, body, image, tags } = req?.body;
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO content 
      (
        title, 
        body, 
        tags, 
        image
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
      [title, body, tags, image]
    );

    res.status(200).json({
      data: {
        title: rows[0]?.title,
        body: rows[0]?.body,
        tags: rows[0]?.tags,
        image: rows[0]?.image,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};
