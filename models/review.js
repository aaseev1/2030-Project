const Review = (Title, Review, Rating, UserId, Username, PostedAt) => {
    return {
        title: Title,
        review: Review,
        rating: Rating,
        userId: UserId,
        username: Username,
        postedAt: PostedAt
    }
}
module.exports = Review