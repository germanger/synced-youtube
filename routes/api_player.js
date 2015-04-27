var express = require('express');
var shared = require('../shared');

var router = express.Router();

router.get('/info', function(req, res) {
    res.json({
        error: false,
        player: shared.player
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
    
    shared.player.videoURL = req.query.videoURL;
    shared.player.state = -1;
    shared.player.time = 0;
    
    // Log
    var message = {
        messageType: 'userChangedVideoURL',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        }
    };
    
    shared.messages.push(message);

    // Broadcast
    shared.io.sockets.emit('userChangedVideoURL', {
        player: shared.player,
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
    
    shared.messages.push(message);

    // Broadcast
    shared.io.sockets.emit('userChangedPlayerState', {
        users: shared.users,
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
    
    shared.player.time = req.query.time;
    shared.player.state = parseInt(req.query.state);
       
    // Log
    var message = {
        messageType: 'userSentCommand',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        },
        player: shared.player
    };
    
    shared.messages.push(message);

    // Broadcast
    shared.io.sockets.emit('userSentCommand', {
        player: shared.player,
        message: message
    });
    
    res.json({
        error: false
    });
});

module.exports = router;