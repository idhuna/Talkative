

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');



//we assume user who created group must be in that group
router.post('/creategroup', async function (req, res) {
    const {groupName, clientID} = req.body;

    console.log(groupName, clientID)
    try{

        //get objectId of the group creator
        let creatorClient = await Client.findOne({ clientID: clientID });
        console.log(creatorClient);

        //random generate later
        const newGroupID = 1111;

        let newGroup = new Group({
            groupID: newGroupID,
            members: [creatorClient._id],
            groupName: groupName,
        });

        console.log(newGroup.members);

        await newGroup.save();

        res.send(newGroup);
        // res.render('index');      
    }
    catch(err) {
        console.log(err);
    }

    

});

module.exports = router;
