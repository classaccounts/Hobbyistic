const mongoose = require('mongoose');
const User = mongoose.model('User');
const Hobby = mongoose.model('Hobby');
const Widgets = mongoose.model('Widgets');
const passport = require('passport');
const auth = require('../routes/auth');
const { register } = require('./user.controller');

module.exports.addHobby = (req, res, next) => {
    if (req.auth == null) {
        return res.status(401).json({errors: {user: "Unauthorized"}}); 
    }
    User.findById(req.auth.id).then(function(user){
        if (!user) { 
            return res.status(401).json({errors: {user: "Unauthorized"}}); 
        }
        let hobby = new Hobby();
        hobby.name = req.body.hobby.name;
        hobby.user = req.auth.id;
        hobby.save((err, doc) => {
            if (!err) {
                const newWidget = new Widgets({
                    user: req.auth.id,
                    hobby: doc._id,
                    taskWidget: {
                        tasks: [{
                            task: 'New Task',
                            completed: false
                        }]
                    },
                    notesWidget: {
                        note: 'simple note'
                    },
                    externalLinksWidget: {

                    }
                });
                newWidget.save((error, widget) => {
                    if (error) {
                        console.log('could not setup default widgets');
                        console.log(error);
                    } else {
                        //sending doc later
                    }
                });
                res.send(doc);
            } else {
                return next(err);
            }
        });
    });
}

module.exports.getHobbies = (req, res, next) => {
    if (req.auth == null) {
        return res.status(401).json({errors: {user: "Unauthorized"}}); 
    }
    User.findById(req.auth.id).then(function(user){
        if (!user) { 
            return res.status(401).json({errors: {user: "Unauthorized"}}); 
        }
        Hobby.find({ "user": { _id: req.auth.id}})
            .then(function(hobbies){
                return res.status(200).json(hobbies);
            }).catch((err) => {
                return res.status(500).json({error: err});
            });
    });
}

module.exports.getSingleHobby = (req, res, next) => {
    if (req.auth == null) {
        return res.status(401).json({errors: {user: "Unauthorized"}}); 
    }
    User.findById(req.auth.id).then(function(user){
        if (!user) { 
            return res.status(401).json({errors: {user: "Unauthorized"}}); 
        }
        Hobby.findOne({ "user": { _id: req.auth.id}, "_id": {_id: req.params.hobbyId}})
            .then(function(hobby){
                return res.status(200).json(hobby);
            }).catch((err) => {
                return res.status(500).json({error: err});
            });
    });
}



module.exports.deleteHobby = (req, res, next) => {
    if (req.auth == null) {
        return res.status(401).json({errors: {user: "Unauthorized"}}); 
    }
    User.findById(req.auth.id).then(function(user){
        if (!user) { 
            return res.status(401).json({errors: {user: "Unauthorized"}}); 
        }
        Hobby.deleteOne({ "user": { _id: req.auth.id}, "_id": {_id: req.params.hobbyId}})
            .then(function(hobby){
                Widgets.deleteOne({hobby: req.params.hobbyId}).then(()=>{
                    return res.status(200).json({message:"Hobby and widget deleted"});
                });
            }).catch((err) => {
                return res.status(500).json({error: err});
            });
    });
}

module.exports.updateHobby = (req, res, next) => {
    if (req.auth == null) {
        return res.status(401).json({errors: {user: "Unauthorized"}}); 
    }
    User.findById(req.auth.id).then(function(user){
        if (!user) { 
            return res.status(401).json({errors: {user: "Unauthorized"}}); 
        }
        Hobby.findOneAndUpdate({ "user": { _id: req.auth.id}, "_id": {_id: req.params.hobbyId}}, req.body.hobby, {new: true}, (err, doc) => {
            if (!err)
                res.status(200).json({ message: "Hobby Updated" , updatedHobby: doc});
            else {
                res.status(500).json({ message: "This hobby does not exist" , updatedHobby: doc});
                return next(err);
            }
        });
    });
}

