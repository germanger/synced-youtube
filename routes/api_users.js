var express = require('express');
var _ = require('underscore');
var shared = require('../shared');

var router = express.Router();

router.get('/rename', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    if (req.query.username == '') {
        res.json({
            error: true,
            message: 'Blank name is not allowed'
        });
        
        return;
    }
    
    var oldUsername = res.user.username;
    res.user.username = req.query.username
    
    // Log
    var message = {
        messageType: 'userChangedName',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        },
        data: {
            oldUsername: oldUsername,
            newUsername: res.user.username
        }
    };
    
    shared.rooms[res.user.roomId].messages.push(message);
    
    // Broadcast
    shared.io.to(res.user.roomId).emit('userChangedName', {
        users: _.chain(shared.users)
        .where({ roomId: res.user.roomId })
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                playerState: user.playerState,
                isTyping: user.isTyping
            }
        }),
        message: message
    });

    res.json({
        error: false,
        message: ''
    });
});

router.get('/updateIsTyping', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    res.user.isTyping = JSON.parse(req.query.isTyping);
       
    // Broadcast
    shared.io.to(res.user.roomId).emit('userUpdatedIsTyping', {
        users: _.chain(shared.users)
        .where({ roomId: res.user.roomId })
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                playerState: user.playerState,
                isTyping: user.isTyping
            }
        }),
    });

    res.json({
        error: false,
        message: ''
    });
});

router.get('/list', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    res.json({
        error: false,
        users: _.chain(shared.users)
        .where({ roomId: res.user.roomId })
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                playerState: user.playerState,
                isTyping: user.isTyping
            }
        }),
    });
});

module.exports = router;