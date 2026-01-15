// controllers/listings.js
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', async (req, res) => {
     try{
        const getAllListings = await Listing.find({}).populate('owner');
        console.log('all listings', getAllListings)
        res.render('listings/index.ejs',{
            listings : getAllListings
        })
    }catch(error){

        console.error();
    }

   
})

router.get('/new', (req, res)=> {
    res.render('listings/new.ejs')
})


router.post('/', async (req, res)=> {
    
    req.body.owner = req.session.user._id
    await Listing.create(req.body)
    res.redirect('/listings')
})

router.get('/:listingId', async (req, res)=>{
    try{
       const listingId =  req.params.listingId
       const populatedListing = await Listing.findById(listingId).populate('owner')
       const userHasFavorited = populatedListing.favoritedByUsers.some((user)=>{
        // convert data objectId to string
         return user == req.session.user._id;
});
        res.render('listings/show.ejs', {listing : populatedListing, userHasFavorited : userHasFavorited })

    }catch(error){
        console.log(error)
    }
})
// DELETE /lisitng/:lisitng 

router.delete('/:listingId', async (req, res)=>{
    try{
        console.log('listingId', req.params.listingId)
        const listing = await Listing.findById(req.params.listingId);
        if(listing.owner.equals(req.session.user._id)){
            console.log('permission granted')
            await Listing.deleteOne();
            res.redirect('/listings')
        }else {
            res.send('You do not have the permission to delete this listing')
    }

    }catch(error){
        console.log(error)
    }
})

// edit lisitng

router.get('/:listingId/edit', async (req, res) =>{
    try{
        const currentListing = await Listing.findById(req.params.listingId)
        console.log(req.params.listingId)
        res.render('listings/edit.ejs',{listing :currentListing})


    } catch(error){
        console.log(error)
        res.redirect('/')
    }
})

// controllers/listings.js

// controllers/listings.js

router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/:listingId/favourited-by/:userId', async (req, res)=>{
    try{
    // findAndUpdate
    //$push- mongo version of push
    await Listing.findByIdAndUpdate(req.params.listingId,{
        $push:{favoritedByUsers: req.params.userId},
    })
    res.redirect(`/listings/${req.params.listingId}`)
    

    }catch(error){
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/:listingId/favourited-by/:userId', async (req, res)=>{
    try{
    // findAndUpdate
    //$push- mongo version of push
    await Listing.findByIdAndUpdate(req.params.listingId,{
        $pull:{favoritedByUsers: req.params.userId},
    })
    res.redirect(`/listings/${req.params.listingId}`)
    

    }catch(error){
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router;

// favoutite by router
// POST/listings/:listingId/favourited-by/:userId