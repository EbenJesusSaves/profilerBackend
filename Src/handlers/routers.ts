import { pool } from "./user";

export const postContent = async (req, res, next) => {
  const { title, body, image, tags, posted_by } = req?.body;
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO content 
      (
        title, 
        body, 
        tags, 
        image, 
        posted_by
    ) 
    VALUES 
    (
        $1, 
        $2, 
        $3, 
        $4,
        $5
    ) 
    RETURNING *
    ;
    `,
      [title, body, tags, image, posted_by]
    );

    res.status(200).json({
      data: {
        title: rows[0]?.title,
        body: rows[0]?.body,
        tags: rows[0]?.tags,
        image: rows[0]?.image,
        posted_by: rows[0]?.posted_by,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};
export const getPosts = async (req, res, next) => {
  const { title, body, image, tags } = req?.body;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM content
    `
    );
    let data = rows;
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};
export const insertComment = async (req, res, next) => {
  const { post_id, body, commented_by } = req?.body;
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO  comments 
  (
        post_id, 
        body,
        commented_by  
  )
      VALUES
  (
     $1, 
     $2,
     $3
  )
     RETURNING *

 ;`,
      [post_id, body, commented_by]
    );
    let data = rows;
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unable to comment try again",
    });
  }
};
export const getPost = async (req, res, next) => {
  const { id } = req?.params;
  try {
    const { rows } = await pool.query(
      `
      SELECT  comments.body AS comments_body,content.*, comments.post_id as comment_post_id  
      FROM content 
      LEFT JOIN comments ON content.id = comments.post_id 
      WHERE content.id = $1
      `,
      [id]
    );
    let post = null;
    let comments = [];
    rows.forEach((row) => {
      if (!post) {
        post = {
          id: row.id,
          title: row.title,
          body: row.body,
          image: row.image,
          tags: row.tags,
          posted_by: row.posted_by,
        };
      }
      if (row.comments_body) {
        comments.push({
          body: row.comments_body,
          post_id: row.comment_post_id,
          commented_by: row.commented_by,
        });
      }
    });

    const data = {
      ...post,
      comments,
    };
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};
