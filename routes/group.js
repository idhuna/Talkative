var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');

function UserException(code, message){
    this.code = code;
    this.message = message;
}

//we assume user who created group must be in that group
router.post('/creategroup', async function (req, res) {
    console.log(req.body)
    const {groupName, clientID} = req.body;

    console.log(groupName, clientID)
    try{

        //get objectId of the group creator
        let creatorClient = await Client.findOne({ clientID: clientID });

        if(!creatorClient){
            throw {'name': 'NullUserError',
                    'message': 'group creator information is not found in database'};
            
        }

        let newGroup = new Group({
            groupName: groupName,
            members: [creatorClient._id],
        });


        let documentresult = await newGroup.save();


        updatedJoinedGroups = [...creatorClient.joinedGroups, documentresult._id];
        Client.update({_id:creatorClient._id},{$set:{joinedGroups:updatedJoinedGroups}})
        console.log(creatorClient);
        console.log("LOLOLOLOL")
        console.log(updatedJoinedGroups);
        creatorClient.update({joinedGroups: updatedJoinedGroups});

        res.send(newGroup);
        // res.render('index');      
    }
    catch(err) {
        if(err.name === 'NullUserError'){
            // res.status('404').send(err.message);
            res.status('400').send(err);
        }
        else if(err.name === 'BulkWriteError'){
            res.status('403').send('group name exists')
        }
        else{    
            res.status(500).send('internal server error');
            console.log(typeof(err));
            console.log(err);
        }
    }

    

});

router.get('/allgroups',async (req,res) => {
    let groups = await Group.find()
    console.log(groups)
    let result = { data: "still implementing"}
    res.json(result)
})

module.exports = router;
