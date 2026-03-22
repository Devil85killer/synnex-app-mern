const { News } = require("../models/newsModel");

const createNewsController = async (req, res) => {
  try {
    const allowedRoles = ["teacher", "faculty", "admin", "college"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: "Access Denied" });
    }

    const { title, type, content } = req.body;
    const createdBy = req.user._id;

    const news = await News.create({ title, type, content, createdBy });
    res.status(201).json({ status: "success", data: { news } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error publishing news" });
  }
};

const getAllNewsController = async (req, res) => {
  try {
    const news = await News.find().populate("createdBy", "firstName lastName role").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { news } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error fetching news" });
  }
};

const deleteNewsController = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "Deleted" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error deleting news" });
  }
};

module.exports = { createNewsController, getAllNewsController, deleteNewsController };