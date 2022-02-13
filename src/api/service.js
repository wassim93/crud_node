const express = require("express");

const monk = require("monk");
const joi = require("joi");

const db = monk(process.env.MONGO_URI);
const dataCollection = db.get("data");

const userSchema = joi.object({
  firstname: joi.string().trim().required(),
  lastname: joi.string().trim(),
});

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await dataCollection.find({});
    res.json(items);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await dataCollection.findOne({
      _id: req.params.id,
    });
    if (item) {
      res.json(item);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    const inserted = await dataCollection.insert(value);
    res.json(inserted);
  } catch (error) {
    //res.json(error.message);
    console.log(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const value = await userSchema.validateAsync(req.body);
    const updated = await dataCollection.update(
      {
        _id: id,
      },
      {
        $set: value,
      }
    );
    if (res.status(200)) {
      res.json("updated successfully");
    }
  } catch (error) {}
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await dataCollection.remove({ _id: id });
    if (res.status(200)) {
      res.json("deleted successfully");
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
