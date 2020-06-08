//bot library for page https://7strangers.com
var request = require("request")
var events = require("events")

var baseUrl = "https://7strangers.com/inc/"
const j = request.jar()

class Bot {
  constructor(interval) {
    this.events = new events.EventEmitter()
    this.id = null
    this.interval = interval || 2000

    var bot = this
    setInterval(() => {
      if (bot.connected) {
        var url = baseUrl + "listenToReceive.php?userId=" + bot.id
        request.get(url, function (err, response, body) {
          if (body == "||--noResult--||") {
            bot.connected = false
            bot.events.emit("strangerLeft")
          }
          else if (body != undefined && body != "")
            bot.events.emit("gotMessage", body)
        })
      }
    }, this.interval)
  }

  getOnlineUsers() {
    var bot = this
    let url = baseUrl + "getNumberOfUsers.php"
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("onlineUsers", body)
    })
  }

  startChat() {
    var bot = this
    if (bot.connected) return
    var url = baseUrl + "startChat.php"
    request.get("https://7strangers.com/chat", { jar: j }, function () {
      request.get(url, { jar: j }, function (err, response, body) {
        if (err)
          bot.events.emit("internalError", err)
        if (parseInt(body)) {
          bot.id = body
          bot.randomChat()
          bot.events.emit("connecting")
        } else bot.events.emit("connecting", body)
      })
    })
  }

  randomChat() {
    var bot = this
    if (bot.connected) return
    var url = baseUrl + "randomChat.php?userId=" + bot.id
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.stranger = body
      bot.connected = true
      bot.events.emit("connected")
    })
  }

  leaveChat() {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "leaveChat.php?userId=" + bot.id
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("left")
    })
  }

  sendMessage(msg) {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "sendMsg.php?userId=" + bot.id + "&strangerId=" + bot.stranger + "&msg=" + msg
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("sentMessage", msg)
    })
  }

  startTyping() {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "/typing.php?userId=" + bot.id;
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("startedTyping")
    })
  }

  stopTyping() {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "/stopTyping.php?userId=" + bot.id;
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("stoppedTyping")
    })
  }

  getStrangerTyping() {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "/isTyping.php?strangerId=" + bot.stranger;
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("isTyping", body)
    })
  }

  saveLog() {
    var bot = this
    if (!bot.connected) return
    var url = baseUrl + "/saveLog.php?userId=" + bot.id + "&strangerId=" + bot.stranger
    request.get(url, function (err, response, body) {
      if (err)
        bot.events.emit("internalError", err)
      bot.events.emit("log", body)
    })
  }
}
module.exports = Bot 