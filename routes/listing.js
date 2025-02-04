const express = require("express");
const router = express.Router();   
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validateListing, validateReview} = require('../middleware.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


const listingController = require('../controllers/listings.js');
// omkar malbhare


router.route("/").get( wrapAsync(listingController.index))
    
router.route("/listings/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),
    wrapAsync(listingController.createListing));
   
// new route
router.get("/listings/new",isLoggedIn, listingController.renderNewForm);

// search
router.get("/listings/find/dest", wrapAsync(listingController.destination));

// show route
router.route("/listings/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync( listingController.destroyListing)) 


// Edit route
router.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;