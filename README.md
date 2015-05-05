# synced-youtube
A synced multiuser youtube player

## Demo
The master branch is directly deployed to heroku: https://synced-youtube.herokuapp.com/

## Server side

- Node.JS
- Express
- socket.io

### Routes

- `'/'` : Endpoint for connecting to the socket.io server
- `'/'` : Also returns `index.html` (angular app)
- `'/api/users/list'` : Expects a `socketId`. Returns list of the users in the current room.
- `'/api/users/rename'` : Expects a `socketId` and a `username`
- `'/api/users/updateIsTyping'` : Expects a `socketId` and a `isTyping`
- `'/api/messages/list'` : Expects a `socketId`. List of messages in the current room.
- `'/api/messages/submit'` : Expects a `socketId` parameter and a `body` parameter
- `'/api/messages/clear'` : Expects a `socketId`. Clears all messages.
- `'/api/player/info'` : Expects a `socketId`. Gets the current room player info (current video, time and state)
- `'/api/player/setVideo'` : Expects a `socketId` and a `videoURL`
- `'/api/player/submitState'` : Expects a `socketId` and a `state`
- `'/api/player/submitCommand'` : Expects a `socketId`, a `state`, and a `time`
- `'/api/server/info'` : Returns info about the server (eg. port)

## Client side

- Angular
- Angular's Boostrap UI
- HTML 5 (canvas)
- socket.io
- toaster (notifications)
- scrollglue (scroll to bottom of divs)
- Youtube player API ("iframe_api")
- angular-youtube-embed (angular directive for iframe_api)

## TO-DOs

- Consider the "buffering" state
- Player's timeline control
- Player's volume control
- Player's currentTime/totalTime indicator
