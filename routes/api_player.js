var express = require('express');
var _ = require('underscore');
var shared = require('../shared');

var router = express.Router();

router.get('/info', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }

    res.json({
        error: false,
        player: shared.rooms[res.user.roomId].player
    });
});

router.get('/setVideo', function(req, res) {
    
    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    shared.rooms[res.user.roomId].player.videoURL = req.query.videoURL;
    shared.rooms[res.user.roomId].player.state = -1;
    shared.rooms[res.user.roomId].player.time = 0;
    
    // Log
    var message = {
        messageType: 'userChangedVideoURL',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        }
    };
    
    shared.rooms[res.user.roomId].messages.push(message);

    // Broadcast
    shared.io.to(res.user.roomId).emit('userChangedVideoURL', {
        player: shared.rooms[res.user.roomId].player,
        message: message
    });
    
    res.json({
        error: false
    });
});

router.get('/submitState', function(req, res) {
    
    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    res.user.playerState = parseInt(req.query.state);
       
    // Log
    var message = {
        messageType: 'userChangedPlayerState',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
            playerState: res.user.playerState
        }
    };
    
    shared.rooms[res.user.roomId].messages.push(message);

    // Broadcast
    shared.io.to(res.user.roomId).emit('userChangedPlayerState', {
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
        error: false
    });
});

router.get('/submitCommand', function(req, res) {
    
    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    shared.rooms[res.user.roomId].player.time = req.query.time;
    shared.rooms[res.user.roomId].player.state = parseInt(req.query.state);
       
    // Log
    var message = {
        messageType: 'userSentCommand',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        },
        player: shared.rooms[res.user.roomId].player
    };
    
    shared.rooms[res.user.roomId].messages.push(message);

    // Broadcast
    shared.io.to(res.user.roomId).emit('userSentCommand', {
        player: shared.rooms[res.user.roomId].player,
        message: message
    });
    
    res.json({
        error: false
    });
});

module.exports = router;