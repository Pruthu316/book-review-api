const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Book = require("../models/Book");
const Review = require("../models/Review");

// Add Book
router.post("/books", auth, async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
});

// Get Books with pagination and filter
router.get("/books", async (req, res) => {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const query = {};
    if (author) query.author = new RegExp(author, "i");
    if (genre) query.genre = genre;

    const books = await Book.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    res.json(books);
});

// Get Book by ID with avg rating
router.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) return res.status(404).json({ error: "Book not found" });

    const avgRating = book.reviews.length
        ? book.reviews.reduce((a, r) => a + r.rating, 0) / book.reviews.length
        : 0;

    res.json({ book, averageRating: avgRating.toFixed(2) });
});

module.exports = router;
