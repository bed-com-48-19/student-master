const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const {v4: uuidv4} = require("uuid")

/**
 * 
 * @route Type("Post")
 * create a course
 */
router.post("/create", (req, res) => {
    const {name} = req.body;

    console.log(name);

    // simple Validation
    if (!name) return res.status(400).json({msg: "Please enter a course"});

    // sql for course
    let sqlCheck = `select * from courses where slug = ?`
    let sqlInsert = `INSERT INTO courses SET ? `;
    const slug = slugify(name).toLowerCase();

    db.query(sqlCheck, slug, (err, course) => {
        if (course.length > 0) return res.status(400).json({ msg: "Course Already Exist"});

        const data = {
            course_name: name.toLowerCase(),
            slug: slugify(name).toLowerCase(),
            uid: uuidv4(),
        };

        db.query(sqlInsert, data, (err, result) => {
            if (err) return res.status(400).json({ msg: "unable to insert a course"});

            return res.status(200).json({data});
        });
        
    });
});
/**
 * 
 * this method gets all the courses from the database
 * 
 * @route Type("get")
 * get all 
 */
router.get("/", (req, res) => {
    let getQuery = `SELECT * FROM courses`;

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
    const { course_name, students, slug } = req.body;
    const newSlug = slugify(course_name).toLowerCase();
  
    // if (students.length == 0)
    //   return res.status(400).json({ msg: "Please add students to this course" });
  
    var updatedata =
      "UPDATE courses SET course_name = ?, course_students = ?, slug = ? WHERE slug = ?";
  
    db.query(
      updatedata,
      [
        course_name.toLowerCase(),
        students.toString().toLowerCase(),
        newSlug,
        slug,
      ],
      function (error) {
        if (error) return res.status(400).json({ msg: "Unable to update" });
  
        res.status(200).json({ msg: "course updated successfully" });
      }
    );
});

/**
 * 
 * @route Type("delete")
 * delete a course 
 */
router.delete("/", (req, res) => {
    const { course_id } = req.body;
  
    let delQuery = "DELETE FROM courses WHERE course_id = ?";
    db.query(delQuery, [course_id], (err, result) => {
      if (err) {
        res.send(err).status(400);
      } else {
        res.json({ success: true }).status(200);
      }
    });
});

module.exports = router;