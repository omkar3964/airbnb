const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({accessToken : mapToken});


// for searching using search box
module.exports.destination = async (req,res)=>{
    let {destination} = req.query
    const keywords = destination.split(' ');
    const searchQuery = {
        $or: keywords.map((keyword) => ({
            $or: [
                { title: new RegExp(keyword, 'i') }, // Match in hotelName
                { location: new RegExp(keyword, 'i') },  // Match in location
                { country: new RegExp(keyword, 'i') },   // Match in country
            ],
        })),
    };
    console.log(searchQuery);
    const allListings = await Listing.find(searchQuery);
    res.render('listings/index.ejs',{allListings});
};


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render('listings/index.ejs',{allListings});
};



module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate([{path: 'reviews',populate: { path: 'author' },},
        {path: 'owner',},])
    if(!listing){
        req.flash('error','listing does not found.');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs",{listing})
};


module.exports.createListing = async (req, res , next)=>{

    let response = await geoCodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry
    await newListing.save();
    req.flash('success','New listing created.');
    res.redirect('/listings');
}



module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','listing does not found.');
        res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render('listings/edit.ejs',{listing,originalImageUrl});

}


module.exports.updateListing = async(req,res)=>{
    let {id }= req.params;  
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image =  {url, filename};
        await listing.save();
    }

    req.flash('success','listing was successfully updated.');
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id }= req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash('success','Delete listing successfully.');
    res.redirect("/listings");
}