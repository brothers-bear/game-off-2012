#useful keycode
KEYCODE_LEFT = 37
KEYCODE_UP = 38
KEYCODE_RIGHT = 39
KEYCODE_DOWN = 40
KEYCODE_A = 65
KEYCODE_W = 87
KEYCODE_D = 68
KEYCODE_S = 83
MOVE_SPEED = 7

canvas = undefined
context = undefined
stage = undefined
player = undefined
leftHeld = undefined
upHeld = undefined
rightHeld = undefined
downHeld = undefined
preloader = undefined
# DOM elements

# Moving objects

# Keypress states

# Utilities

#on document load, create keyhandlers
eventHandlers = ->
  console.log $("#game")
  $(document).keydown (event) ->
    console.log "hi"
    
    # cross-browser compatibility
    event = window.event  unless event
    console.log "yes!" + event.keyCode
    switch event.keyCode
      
      # not sure why they return false in the example
      # http://www.createjs.com/Demos/EaselJS/Game.html
      when KEYCODE_LEFT, KEYCODE_A
        leftHeld = true
        return false
      when KEYCODE_UP, KEYCODE_W
        upHeld = true
        return false
      when KEYCODE_RIGHT, KEYCODE_D
        rightHeld = true
        return false
      when KEYCODE_DOWN, KEYCODE_S
        downHeld = true
        return false

  $(document).keyup (event) ->
    
    # cross-browser compatibility
    event = window.event  unless event
    switch event.keyCode
      # not sure why they return false in the example
      # http://www.createjs.com/Demos/EaselJS/Game.html
      when KEYCODE_LEFT, KEYCODE_A
        leftHeld = false
      when KEYCODE_UP, KEYCODE_W
        upHeld = false
      when KEYCODE_RIGHT, KEYCODE_D
        rightHeld = false
      when KEYCODE_DOWN, KEYCODE_S
        downHeld = false

$(document).ready ->
  initCanvas()
  eventHandlers()

initCanvas = ->
  canvas = $("#game")[0]
  context = canvas.getContext("2d")
  stage = new createjs.Stage(canvas)
  stage.mouseEventsEnabled = true
  manifest = [
    src: "/images/antigoliath.jpg"
    id: "player"
  ]
  preloader = new createjs.PreloadJS()
  preloader.onComplete = initGame
  preloader.loadManifest manifest

initGame = ->
  player = new createjs.Bitmap(preloader.getResult("player").result)
  player.x = canvas.width / 2
  player.y = canvas.height / 2
  stage.addChild player
  stage.update()
  createjs.Ticker.addListener window

tick = ->
  player.x -= Math.random()
  player.y -= Math.random()
  player.x -= MOVE_SPEED  if leftHeld
  player.y -= MOVE_SPEED  if upHeld
  player.x += MOVE_SPEED  if rightHeld
  player.y += MOVE_SPEED  if downHeld
  stage.update()
