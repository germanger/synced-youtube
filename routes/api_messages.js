var express = require('express');
var _ = require('underscore');
var shared = require('../shared');

var router = express.Router();

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
        messages: shared.rooms[res.user.roomId].messages
    });
});

router.get('/submit', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    // Create message
    var message = {
        messageType: 'userBroadcastsMessage',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        },
        chatMessage: {
            body: req.query.body
        }
    };

    // Save the new message
    shared.rooms[res.user.roomId].messages.push(message);
    
    // Broadcast the new message
    shared.io.to(res.user.roomId).emit('userBroadcastsMessage', message);

    res.json({
        error: false
    });
});

router.get('/clear', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }

    // Clear messages
    shared.rooms[res.user.roomId].messages.length = 0;
    
    // Log
    var message = {
        messageType: 'userClearedMessages',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        }
    };
    
    shared.rooms[res.user.roomId].messages.push(message);

    // Broadcast
    shared.io.to(res.user.roomId).emit('userClearedMessages', {
        message: message
    });

    res.json({
        error: false
    });
});

module.exports = router;