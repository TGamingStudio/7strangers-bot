# 7strangers-bot
Unofficial library for 7strangers bot

[7Strangers](https://7strangers.com) is alternative to [Omegle](https://www.omegle.com/).
Both websites are pretty much populated with bots, with the only difference omegle has much more users and settings and also videochat.

## Note
Please remember you're doing this on your own. Abusing the api and leading in ban is not my responsibility
I'm not sure what kinds of bans are there. 
Some i found:
- Too many requests ban for session id (Refreshing session (Deleting cookies (Reconnecting to a new chat in this case)) unbans you)

# Bot installation
0. Install [node.js](https://nodejs.org/en/download/) and any code editor (if you haven't yet)
1. In new directory run `npm i request` command
2. Download `7strangerslibrary.js` file
3. create `server.js` file (or call it whatever you want)
4. Edit `server.js` file and program your bot
5. Run the bot with `node server.js` command

## server.js file
### Initialization
Two needed lines
```js
var Bot = require("./7strangerslibrary")
var bot = new Bot(interval) //change the interval to whatever you want (Check messages interval) Default: 2000 (milliseconds) 
```
### Events 
Use any of provided events
<details>
  <summary>All events here</summary>
  
 ```javascript 
bot.events.on("onlineUsers", (amount) => {
  console.log("Online users: " + amount)
})

bot.events.on("connecting", (err) => {
  if (err)
    console.log("Connection error: " + err)
  else
    console.log("Connecting")
})

bot.events.on("connected", () => {
  console.log("Conected")
})

bot.events.on("left", () => {
  console.log("Bot left the chat")
})

bot.events.on("sentMessage", (msg) => {
  console.log("Bot send a message: " + msg)
})

bot.events.on("strangerLeft", () => {
  console.log("The stranger left")
})

bot.events.on("gotMessage", (msg) => {
  console.log("The stranger sent a message: " + msg)
})

bot.events.on("startedTyping", () => {
  console.log("Bot started typing")
})

bot.events.on("stoppedTyping", () => {
  console.log("Bot stopped typing")
})

bot.events.on("isTyping", (typing) => {
  console.log("Is stranger typing:" + typing)
})

bot.events.on("log", (log) => {
  console.log("Log saved: " + log)
})
```
</details>

### Functions
Run those functions for custom functionality
(I havent tested all of them, so don't know any bugs (Feel free to report any in the issues page))
- `getOnlineUsers()` - fires the `onlineUsers` event once finished
- `startChat()` - Connects to a random user, fires `connecting` and `connected` events
- `leaveChat()` - Leaves the chat
- `sendMessage(msg)` - sends a message, fires `sentMessage` event
- `startTyping()` - Notifies the stranger about that you're typing (Haven't used this one yet), fires `startedTyping` event
- `stopTyping()` - Notifies the stranger about that you're no longer typing (Haven't used this one yet), fires `stoppedTyping` event
- `getStrangerTyping()` - fires the `isTyping` event once finished
- `saveLog()` - Does something **lmao**, fires the `log` event once finished

## Simple bot example
```js
//Bot automaticly connects to a stranger, sends a message and reconnects to a new one
var Bot = require("./7strangerslibrary")
var bot = new Bot()
bot.startChat()
bot.events.on("connecting", (err) => {
  if (err)
    console.log("Connection error: " + err)
  else
    console.log("Connecting")
})
bot.events.on("connected", () => {
  console.log("Conected")
  bot.sendMessage("Hi!")
})
bot.events.on("sentMessage", (msg) => {
  console.log("Bot send a message: " + msg)
  bot.leaveChat()
})
bot.events.on("left", () => {
  console.log("Bot left the chat")
  bot.startChat()
})
```
