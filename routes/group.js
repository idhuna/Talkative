var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');

function UserException(code, message) {
    this.code = code;
    this.message = message;
}

//we assume user who created group must be in that group
router.post('/creategroup', async function (req, res) {
    console.log(req.body)
    const { groupName, clientID } = req.body;

    console.log(groupName, clientID)
    try {

        //get objectId of the group creator
        let creatorClient = await Client.findOne({ clientID: clientID });

        if (!creatorClient) {
            throw {
                'name': 'NullUserError',
                'message': 'group creator information is not found in database'
            };

        }
        else if (creatorClient.joinedGroups.includes(groupName)) {
            throw {
                'name': 'BulkWriteError',
            }
        }

        let newGroup = new Group({
            groupName: groupName,
            members: [clientID],
        });

        await Promise.all([newGroup.save(),
        Client.update({ "clientID": clientID }, { $push: { "joinedGroups": groupName, "lastmsg": null, "break": false } })
        ]);


        res.send(newGroup);
        // res.render('index');      
    }
    catch (err) {
        if (err.name === 'NullUserError') {
            // res.status('404').send(err.message);
            res.status('400').send(err);
        }
        else if (err.name === 'BulkWriteError') {
            console.log(err);
            res.status('403').send('group name exists')
        }
        else {
            res.status(500).send('internal server error');
            console.log(typeof (err));
            console.log(err);
        }
    }



});

<<<<<<< Updated upstream
router.post('/all',async (req,res) => {
    let groups = await Group.find()
    res.json(groups)
=======
router.get('/all', async (req, res) => {
    let groups = await Group.find()
    console.log(groups)
    let result = { data: "still implementing" }
    res.json(result)
>>>>>>> Stashed changes
})


module.exports = router;
