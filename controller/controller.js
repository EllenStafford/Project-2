// Dependencies
var express = require("express");
var db = require("../models");

var router = express.Router();
var path = require("path");

// API Routes

// index route loads index.html
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Display achievements with status (goal, in-progress, completed). This works for all three routes.
router.get("/api/achievements/status/:status", function (req, res) {
  db.achievement.findAll({
    where: {
      status: req.params.status
    }
  }).then(function (result) {
    return res.json(result);
  });
});

// Create a skill in the skills table in db
router.post("/api/skills", function (req, res) {
  db.skill.create({
    skills_name: "",
  }).then(function (skill) {
  });
});

// Grab all the skills from the skills table in db
router.get("/api/skills", function(req, res) {
  db.skill.findAll({}).then(function(results) {
    res.json(results)
  });
});

// Create an achievement in the achievement table in db
router.post("/api/achievements", function (req, res) {
  // console.log(req.body.skills);
  db.achievement.create({
    name: "",
    type: "",
    resource_name: "",
    resource_URL: "",
    comments: "",
    status: ""
  }).then(function (achievement) {
    // Connect the skills and achievements as many-to-many - option 1
    for (var i = 0; i < req.body.skills.length; i++) {
      achievement.addSkill(req.body.skills[i]);
    }
    res.json(achievement);
  });
});

// Connect the skills and achievements as many-to-many - option 2
router.post("/api/achievements/:id/skills", function (req, res) {
  var skillId = req.body.skillId;
  var achievementId = req.params.id;

  db.achievement.findById(achievementId).then(function(result) {
    console.log(result);
    result.addSkill(skillId);
  });
});

module.exports = router;