import { sendMail } from "./email/email";
import { pool } from "./user";

export const postContent = async (req, res, next) => {
  const { title, body, image, tags, posted_by, from } = req?.body;
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
    if (from === "draft") {
      deleteDraft(req, res);
    }
  } catch (error) {
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};
export const getPosts = async (req, res, next) => {
  const { title, body, image, tags, username } = req?.body;
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
export const getAminPosts = async (req, res, next) => {
  const { posted_by } = req?.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM content WHERE posted_by = $1
    `,
      [posted_by]
    );
    let data = rows;
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
      SELECT  comments.body AS comments_body,content.*, comments.post_id as comment_post_id, comments.commented_by  
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
          date: row.date,
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

export const emailNotification = async (req, res) => {
  const { clientAccount, clientEmail, clientSubject } = req?.body;
  await sendMail({ clientAccount, clientEmail, clientSubject });
  res.status(200).json({ message: "email received successfully" });
};

// delete post
export const deletePost = async (req, res) => {
  const { id, posted_by } = req?.query;
  try {
    await pool.query(`DELETE FROM content where id= $1 AND posted_by = $2`, [
      id,
      posted_by,
    ]);
    res.status(204).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

// edit post
export const editPost = async (req, res) => {
  const { title, body, image, tags, id, posted_by } = req?.body;

  try {
    const { rows } = await pool.query(
      `
  UPDATE content 
    SET 
      title = $2, 
      tags = $3, 
      image = $4, 
      body = $5
    WHERE id = $1 AND posted_by = $6
  `,
      [id, title, tags, image, body, posted_by]
    );
    res.status(200).json({ message: "post updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something went wrong while updating contents" });
  }
};

export const searchPost = async (req, res) => {
  const { keyword } = req.body;
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM content WHERE title ILIKE $1
      `,
      [`%${keyword}%`]
    );

    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong on the server " });
  }
};

// save to draft
// search post by tag

// delete comment
export const deleteComment = async (req, res) => {
  const { id, commented_by } = req.body || {};

  try {
    await pool.query(
      `DELETE FROM comments WHERE id = $1 AND commented_by =$2 `,
      [id, commented_by]
    );
    res.status(204).json({ message: "comment deleted successfully " });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//============================ DRAFT POSTS ==========================//
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//                                                                   //
//============================ =========== ==========================//

export const postDraftPost = async (req, res, next) => {
  const { title, body, image, tags, created_by } = req?.body;
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO draft_posts 
      (
        title, 
        body, 
        tags, 
        image, 
        created_by
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
      [title, body, tags, image, created_by]
    );

    res.status(200).json({
      data: {
        title: rows[0]?.title,
        body: rows[0]?.body,
        tags: rows[0]?.tags,
        image: rows[0]?.image,
        created_by: rows[0]?.created_by,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "something rent wrong",
    });
  }
};

export const getDraftPosts = async (req, res) => {
  const { created_by, id } = req.params;
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM draft_posts 
         WHERE 
            
          created_by = $1
      `,
      [created_by]
    );
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
export const getDraftPost = async (req, res) => {
  const { created_by, id } = req.body;
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM draft_posts 
         WHERE 
           id = $1 
          AND 
          created_by = $2
      `,
      [id, created_by]
    );
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const editDraftPost = async (req, res) => {
  const { title, body, tags, image, created_by, id } = req.body;
  try {
    const { rows } = await pool.query(
      `
      UPDATE draft_posts 
        SET 
        title = $3, 
        body =$4, 
        tags =$5, 
        image = $6 
      WHERE 
        id = $1 AND created_by = $2 
      RETURNING *
    `,
      [id, created_by, title, body, tags, image]
    );

    res.status(200).json({ message: "draft updated successfully", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Ops something went wrong" });
  }
};

export const deleteDraft = async (req, res) => {
  const { id, created_by } = req.query;

  try {
    await pool.query(
      `
      DELETE FROM draft_posts WHERE id = $1 AND created_by = $2
      `,
      [id, created_by]
    );
    res.status(204).json({ message: "draft deleted successfully " });
  } catch (error) {
    res.status(500).json({ message: "Sorry something went wrong  " });
  }
};

// check if it has id then it's an update if
// there is no Id then its new and about yet to be create

// search for posts

// UPDATE content SET body = $1, tags =$2, WHERE id = $3

// dashboard for posts written

//check if username is same as posted_by then show delete and edit functionality
