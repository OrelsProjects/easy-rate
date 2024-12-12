"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const funnyNames = {
  high: [
    "Captain Awesome",
    "Sir Laughs-a-Lot",
    "Madame Marvelous",
    "Dr. Delightful",
    "The Incredible Smiler",
    "Gigglemeister",
    "Professor Fun",
    "Laughing Llama",
  ],
  medium: [
    "Meh McAverage",
    "Okayish Ollie",
    "So-So Sally",
    "Middle-of-the-Road Mike",
    "Neutral Nancy",
    "Boring Bob",
    "Plain Jane",
    "Flatline Fred",
  ],
  low: [
    "Grumpy Gus",
    "Debbie Downer",
    "Negative Nancy",
    "Pessimistic Pete",
    "Frowny Frankie",
    "Moody McMoodface",
    "Crybaby Carl",
    "Sulky Sam",
  ],
};

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

function getNameByRating(rating: number): string {
  let category: keyof typeof funnyNames;
  if (rating >= 4) {
    category = "high";
  } else if (rating >= 2) {
    category = "medium";
  } else {
    category = "low";
  }
  const names = funnyNames[category];
  return names[Math.floor(Math.random() * names.length)];
}

export function Demo() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (star: number) => {
    setRating(star);
    setSubmitted(true);

    const newReview: Review = {
      id: Date.now(),
      name: getNameByRating(star),
      rating: star,
      comment: "",
      timestamp: new Date(),
    };

    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setCurrentReviewId(newReview.id);
  };

  const handleCommentSubmit = () => {
    if (currentReviewId) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === currentReviewId ? { ...review, comment } : review
        )
      );
      setComment("");
      setSubmitted(false);
      setCurrentReviewId(null);
      setRating(null);
    }
  };

  return (
    <div className="relative h-full w-full max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Demo Website</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            This is a demo of how Review Popper works on your website.
          </p>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold mr-2">{review.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm"
                  >
                    {review.comment}
                  </motion.p>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          {/* Rating Section */}
          {!submitted && (
            <div className="mt-4">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= (rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comment Section */}
          {submitted && (
            <div className="mt-4">
              <p className="text-center text-muted-foreground mb-4">
                Thank you for your feedback! Add a comment if you'd like:
              </p>
              <Textarea
                className="w-full p-2 mb-4 border rounded"
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleCommentSubmit} className="w-full">
                Submit Comment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
