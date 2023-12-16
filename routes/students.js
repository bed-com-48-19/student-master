const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const {v4: uuidv4} = require("uuid")

/**
 * 
 * @route Type("Post")
 * create a student
 */
router.post("/create", (req, res) => {
  const { name, age, courses, className } = req.body;

  //   Simple validation
  if (!name || !age || !courses || !className) {
    return res.status(400).json({ msg: "Please enter class name" });
  }

  // sql for user
  let sqlCheck = `SELECT * from students WHERE slug = ?`;
  let sqlInsert = "INSERT INTO students SET ?";

  const slug = slugify(name).toLowerCase();

  db.query(sqlCheck, slug, (err, course) => {
    if (course.length > 0)
      return res.status(400).json({ msg: "Student Exists" });

    const data = {
      student_name: name.toLowerCase(),
      uid: uuidv4(),
      slug,
      student_age: age.toString(),
      student_course: courses.toString().toLowerCase(),
      student_class: className.toLowerCase(),
    };

    db.query(sqlInsert, data, (err) => {
      if (err) {
        return res.status(401).json({ msg: "Unable to insert a student" });
      }

      return res.status(200).json({ data });
    });
  });
});

/**
 * 
 * @route Type("Get")
 * Get all students
 */
router.get("/", (req, res) => {
  let getQuery = `SELECT * FROM students`;

  db.query(getQuery, (err, result) => {
    return res.status(200).json(result);
  });
});

/**
 * 
 * @route Type("Put")
 * update students
 */
router.put("/", (req, res) => {
  const { name, age, courses, className, slug, uid } = req.body;
  const newSlug = slugify(name).toLowerCase();

  var updatedata =
    "UPDATE students SET student_name = ?, student_age = ?, student_course = ?, student_class = ?, slug = ? WHERE slug = ?";

  db.query(
    updatedata,
    [
      name.toLowerCase(),
      age,
      courses.toString(),
      className.toLowerCase(),
      newSlug,
      slug,
    ],
    function (error) {
      if (error) return res.status(400).json({ msg: "Unable to update" });

      res
        .status(200)
        .json({ name, age, courses, className, newSlug, updated: true, uid });
    }
  );
});

/**
 * 
 * @route Type("Delete")
 * Delete Student
 */
router.delete("/:uid", (req, res) => {
  const { uid } = req.params;
  let delQuery = "DELETE FROM students WHERE uid = ?";
  db.query(delQuery, [uid], (err) => {
    if (err) {
      res.send(err).status(400);
    } else {
      res.json({ success: true }).status(200);
    }
  });
});

module.exports = router;
