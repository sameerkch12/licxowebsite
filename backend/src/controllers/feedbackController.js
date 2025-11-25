const Feedback = require("../models/feedbackModel");

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;
        const feedback = new Feedback({ name, email, rating, message });
        await feedback.save();
        res.status(200).json({ success: true, message: "Feedback received successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
