var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');


//we assume user who created group must be in that group
router.post('/creategroup', async function (req, res, next) {
    console.log(req.body);

    const {groupName, clientID} = req.body;

    console.log(newGroup.members);


    try{

        //get objectId of the group creator
        let creatorClient = await Client.findOne({ clientID: clientID });

        //random generate later
        const newGroupID = 1111;

        let newGroup = new Group({
            groupID: newGroupID,
            members: [creatorClient._id],
            groupName: groupName,
        });

        await newGroup.save();        
    }
    catch(err) {
        console.log(err);
    }

    

});

module.exports = router;
