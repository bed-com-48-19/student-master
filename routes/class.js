const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const {v4: uuidv4} = require("uuid")
/**
 * 
 * @route Type("Post")
 * create a class
 */
router.post("/create", (req, res) => {
    const { name } = req.body;
  
    // Simple validation
    if (!name) {
      return res.status(400).json({ msg: "Please enter class name" });
    }
  
    // sql for user
    let sqlCheck = `SELECT * from classes WHERE slug = ?`;
    let sqlInsert = "INSERT INTO classes SET ?";
    const slug = slugify(name).toLowerCase();
  
    db.query(sqlCheck, slug, (err, classes) => {
      if (classes.length > 0) return res.status(400).json({ msg: "Class Already Exists" });
  
      const data = {
        class_name: name.toLowerCase(),
        slug: slugify(name).toLowerCase(),
        uid: uuidv4(),
      };
  
      db.query(sqlInsert, data, (err) => {
        if (err) {
          return res.status(401).json({ msg: "Unable to insert class" });
        }
  
        return res.status(200).json({ data });
      });
    });
  });

  /**
 * 
 * this method gets all the classes from the database
 * 
 * @route Type("get")
 * get all 
 */
router.get("/", (req, res) => {
    let getQuery = `SELECT * FROM classes`;

    db.query(getQuery, (err, results) => {
        return res.status(200).json(results);
    });
});

/**
 * 
 * @route Type("update")
 * update a course 
 */
router.put("/", (req, res) => {
    const { class_name, slug } = req.body;
    const newSlug = slugify(class_name).toLowerCase();
  
    var updatedata = "UPDATE classes SET class_name = ?, slug = ? WHERE slug = ?";
  
    console.log(req.body);
  
    db.query(
      updatedata,
      [class_name.toLowerCase(), newSlug, slug],
      function (error) {
        if (error) return res.status(400).json({ msg: "Unable to update the class" });
  
        res.status(200).json({ msg: " class updated" });
      }
    );
});
/**
 * 
 * @route Type("delete")
 * delete a class 
 */
router.delete("/:uid", (req, res) => {
    const { uid } = req.params;
    let delQuery = "DELETE FROM classes WHERE uid = ?";
    db.query(delQuery, [uid], (err, result) => {
      if (err) {
        res.send(err).status(400);
      } else {
        res.json({ success: true }).status(200);
      }
    });
  });

module.exports = router;