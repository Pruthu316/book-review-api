const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Review = require("../models/Review");
const Book = require("../models/Book");

// Add Review
router.post("/books/:id/reviews", auth, async (req, res) => {
    const existing = await Review.findOne({
        user: req.user.id,
        book: req.params.id,
    });
    if (existing) return res.status(400).json({ error: "Already reviewed" });

    const review = new Review({
        ...req.body,
        book: req.params.id,
        user: req.user.id,
    });
    await review.save();

    await Book.findByIdAndUpdate(req.params.id, {
        $push: { reviews: review._id },
    });
    res.status(201).json(review);
});

// Update Review
router.put("/reviews/:id", auth, async (req, res) => {
    const review = await Review.findOne({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!review) return res.status(403).json({ error: "Unauthorized" });

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
});

// Delete Review
router.delete("/reviews/:id", auth, async (req, res) => {
    const review = await Review.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!review)
        return res.status(403).json({ error: "Unauthorized or not found" });

    await Book.findByIdAndUpdate(review.book, {
        $pull: { reviews: review._id },
    });
    res.json({ message: "Review deleted" });
});

module.exports = router;
