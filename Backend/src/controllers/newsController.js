// controllers/newsController.js

// 🔥 SAFELY IMPORT MODEL (Crash-proof import)
const NewsModel = require("../models/newsModel");
const News = NewsModel.News || NewsModel;

const createNewsController = async (req, res) => {
  try {
    const allowedRoles = ["teacher", "faculty", "admin", "college"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: "Access Denied: You do not have permission to post news." });
    }

    // 🔥 FIX: req.body se 'author' bhi nikal rahe hain
    const { title, type, content, author } = req.body;
    
    // SAFE USER ID CHECK
    const createdBy = req.user._id || req.user.id;

    // 🔥 FIX: Asli naam ensure kar rahe hain taaki blank na jaye
    const finalAuthor = author || (req.user.firstName ? `${req.user.firstName} ${req.user.lastName || ''}` : "College Admin");

    // Ab author aur createdBy dono safely save honge
    const news = await News.create({ 
      title, 
      type, 
      content, 
      createdBy, 
      author: finalAuthor 
    });
    
    res.status(201).json({ status: "success", data: { news } });
  } catch (error) {
    console.error("Error publishing news:", error);
    // 🔥 MAGIC: Agar galti se crash hua, toh actual reason console aur network tab mein aayega
    res.status(500).json({ status: "fail", message: "Error publishing news", exactError: error.message });
  }
};

const getAllNewsController = async (req, res) => {
  try {
    // Populate firstName, lastName, and role so frontend can display the author
    const news = await News.find()
      .populate("createdBy", "firstName lastName role")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ status: "success", data: { news } });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ status: "fail", message: "Error fetching news" });
  }
};

const deleteNewsController = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
        return res.status(404).json({ status: "fail", message: "News not found." });
    }

    // SAFE USER ID CHECK
    const userId = req.user._id || req.user.id;

    // SECURITY CHECK: Only Admin or the Creator can delete
    if (req.user.role !== "admin" && news.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ status: "fail", message: "Access Denied: You cannot delete this notice." });
    }

    await News.findByIdAndDelete(newsId);
    
    res.status(200).json({ status: "success", message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ status: "fail", message: "Error deleting news" });
  }
};

module.exports = { createNewsController, getAllNewsController, deleteNewsController };
