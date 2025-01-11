const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title:{
        type:String,
        require: true,
    },
    description : String,
    category:{
        type:String,
        require: true,
        enum: [
            'Trending','Rooms', 'Iconic Cities', 'Castle', 'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Mountains', 'Domes', 'Boats'], // Fixed categories
        message: '{VALUE} is not a valid category'
    },
    image:{
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type :Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner:{
        type :Schema.Types.ObjectId,
        ref : "User",
    },
    geometry:{
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },

    },
});

listingSchema.post('findOneAndDelete',async(listing) =>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.reviews}});
    }
})
const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;