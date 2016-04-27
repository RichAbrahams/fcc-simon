document.addEventListener("DOMContentLoaded", function() {

  var gameOn = false;
  var strictOn = false;
  var resetOn = false;
  cpuTurn = false;
  var colorButtonCont = document.querySelector('.colorButtonCont');
  var controlsCont = document.querySelector('.controlsCont');
  var colorButtonsArr = document.querySelectorAll('.colorButton');
  var controlButtonsArr = document.querySelectorAll('.control');
  var onColors = ["rgb(0, 102, 0)", "rgb(153, 0, 0)", "rgb(204, 150, 0)", "rgb(0, 71, 153)"];
  var offColors = ["rgb(51,51,51)", "rgb(102, 0, 0)"];
  var controlColors = ["rgb(160, 0, 0)", "rgb(204, 150, 0)", ""];
  var context = new(window.AudioContext || window.webkitAudioContext)();
  var gainNode = context.createGain();
  gainNode.gain.value = 0.8;
  var freq = [200, 250, 300, 350];
  var progress = document.querySelector('.progBar');
  var modalCont = document.querySelector('.modalCont');
  var modal = document.querySelector('.modalCont');
  var endIcon = document.querySelector('.endIcon');

// object containing game values and methods

  var game = {

    sequence: [],
    counter: 0,
    generateSequence: function() {
      var newSequence = [];
      for (var i = 0; i < 20; i++) {
        function genNum() {
          newNumber = Math.floor((Math.random() * 4));
          if (newNumber === newSequence[newSequence.length - 1] && newSequence[newSequence.length - 1] === newSequence[newSequence.length - 2]) {
            genNum();
          } else {
            newSequence.push(newNumber);
          }
        }
        genNum();
      }
      this.sequence = newSequence;
      console.log(this.sequence);
    },
    activeSequence: function() {
      var active = this.sequence.slice(0, this.counter + 1);
      return active;
    },
    playSequence: function() {
      cpuTurn = true;
      var seqQueue = this.activeSequence();

      function play(input) {
        if (gameOn) {
          toFlash = input[0];
          game.flashButton(toFlash);
          input.shift();
          setTimeout(function() {
            if (input.length > 0 && cpuTurn === true) {
              play(input);
            } else {
              cpuTurn = false;
            }
          }, 1000);
        }
      }
      play(seqQueue);
    },
    flashButton: function(toFlash) {
      console.log('flashing', toFlash);
      buttonSound(toFlash);
      switch (toFlash) {
        case 0:
          colorButtonsArr[0].style.WebkitAnimationName = "flashGreen";
          break;
        case 1:
          colorButtonsArr[1].style.WebkitAnimationName = "flashRed";
          break;
        case 2:
          colorButtonsArr[2].style.WebkitAnimationName = "flashYellow";
          break;
        case 3:
          colorButtonsArr[3].style.WebkitAnimationName = "flashBlue";
          break;
        default:
      }
      setTimeout(function() {
        for (var i = 0; i < colorButtonsArr.length; i++) {
          colorButtonsArr[i].style.WebkitAnimationName = null;
        }
      }, 750);
    },
    reset: function() {
      this.counter = 0;
      progress.value = 0;
    },
    incrementCounter: function() {
      this.counter++;
      progress.value++;
    }
  };

// object containing player input and associated methods

  var player = {

    input: [],
    resetInput: function() {
      this.input = [];
    },
    addToInputQueue: function(e) {
      this.input.push(e);
    },
    checkInput: function() {
      checkIndex = this.input.length - 1;
      lastInput = this.input[checkIndex];
      if (lastInput == game.activeSequence()[checkIndex]) {
        return true;
      } else {
        return false;
      }
    },
    checkFinished: function() {
      if (this.input.length === game.activeSequence().length) {
        return true;
      } else {
        return false;
      }
    },
    checkGameWon: function() {
      if (this.input.length === game.sequence.length) {
        return true;
      } else {
        return false;
      }
    }

  };

// oscillators to generate button sounds

  function buttonSound(i) {
    var oscillator = context.createOscillator();
    oscillator.frequency.value = freq[i];
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    currentTime = context.currentTime;
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.5);
    return;
  }

  function errorSound() {
    var oscillator = context.createOscillator();
    oscillator.frequency.value = 50;
    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    currentTime = context.currentTime;
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.5);
    return;
  }

// start button controller

  function startClick() {
    if (gameOn) {
      if (strictOn) {
        strictClick();
      }
      gameOn = false;
      controlButtonsArr[0].style.backgroundColor = offColors[1];
      colorButtonsArr[0].style.backgroundColor = offColors[0];
      colorButtonsArr[1].style.backgroundColor = offColors[0];
      colorButtonsArr[2].style.backgroundColor = offColors[0];
      colorButtonsArr[3].style.backgroundColor = offColors[0];
      game.reset();
    } else {
      gameOn = true;
      controlButtonsArr[0].style.backgroundColor = controlColors[0];
      colorButtonsArr[0].style.backgroundColor = onColors[0];
      colorButtonsArr[1].style.backgroundColor = onColors[1];
      colorButtonsArr[2].style.backgroundColor = onColors[2];
      colorButtonsArr[3].style.backgroundColor = onColors[3];
      setTimeout(function() {
        game.generateSequence();
        console.log(game.sequence);
        game.playSequence();
      }, 2000);
    }
  }

// strict button controller

  function strictClick() {
    if (gameOn) {
      if (strictOn) {
        strictOn = false;
        controlButtonsArr[1].style.backgroundColor = offColors[1];
      } else {
        strictOn = true;
        controlButtonsArr[1].style.backgroundColor = controlColors[1];
      }
    }
  }

// reset button controller

  function resetClick() {
    if (gameOn) {
      controlButtonsArr[2].style.WebkitAnimationName = 'resetAnim';
      cpuTurn = false;
      game.reset();
      player.resetInput();
      game.generateSequence();
      setTimeout(function() {
        game.playSequence();
        controlButtonsArr[2].style.WebkitAnimationName = null;
      }, 3000);
    } else {

    }
  }

// button click routing

  function controlsClick(e) {
    e = e.target.id;
    console.log(e);
    switch (e) {
      case "start":
        startClick();
        break;
      case "strict":
        strictClick();
        break;
      case "reset":
        resetClick();
        break;
      default:

    }
  }

// color button controller

  function colorClick(e) {
    function mouseUp() {
      colorButtonsArr[e].style.WebkitAnimationName = null;
      colorButtonCont.removeEventListener('mouseup', mouseUp);
      colorButtonCont.removeEventListener('touchend', mouseUp);
      if (player.checkFinished()) {
        if (player.checkGameWon()) {
          progress.value++;
          modalCont.style.WebkitAnimationName = 'modalFade';
          modalCont.style.display = 'initial';
        } else {
          cpuTurn = true;
          player.resetInput();
          game.incrementCounter();
          setTimeout(function() {
            game.playSequence();
          }, 1500);
        }
      }
    }
    if (cpuTurn === false) {
      e = e.target.id[1];
      console.log(game.activeSequence());
      player.addToInputQueue(e);
      if (player.checkInput()) {
        switch (e) {
          case "0":
            console.log('green clicked');
            colorButtonsArr[0].style.WebkitAnimationName = 'flashGreen';
            buttonSound(e);
            break;
          case "1":
            console.log('red clicked');
            colorButtonsArr[1].style.WebkitAnimationName = 'flashRed';
            buttonSound(e);
            break;
          case "2":
            console.log('yellow clicked');
            colorButtonsArr[2].style.WebkitAnimationName = 'flashYellow';
            buttonSound(e);
            break;
          case "3":
            console.log('blue clicked');
            colorButtonsArr[3].style.WebkitAnimationName = 'flashBlue';
            buttonSound(e);
            break;
          default:
        }
        colorButtonCont.addEventListener('touchend', function(e) {
          mouseUp(e);
          e.preventDefault();
        }, false);
        colorButtonCont.addEventListener('mouseup', function(e) {
          mouseUp(e);
          e.preventDefault();
        }, false);
      } else {
        console.log('input error');
        if (strictOn) {
          errorSound();
          cpuTurn = true;
          game.reset();
          player.resetInput();
          game.generateSequence();
          setTimeout(function() {
            game.playSequence();
          }, 2000);
        } else {
          errorSound();
          player.resetInput();
          cpuTurn = true;
          setTimeout(function() {
            game.playSequence();
          }, 2000);
        }
      }
    }
  }

// eventlisteners for button divs

  controlsCont.addEventListener('click', function(e) {
    controlsClick(e);
    e.preventDefault();
  }, false);

  colorButtonCont.addEventListener('touchstart', function(e) {
    if (e.target.id[1] === "0" || e.target.id[1] === "1" || e.target.id[1] === "2" || e.target.id[1] === "3") {
      colorClick(e);
    }
    e.preventDefault();
  }, false);

  colorButtonCont.addEventListener('mousedown', function(e) {
    if (e.target.id[1] === "0" || e.target.id[1] === "1" || e.target.id[1] === "2" || e.target.id[1] === "3") {
      colorClick(e);
    }
    e.preventDefault();
  }, false);

// end modal eventlistener to restart game

  endIcon.addEventListener('click', function() {
    modalCont.style.display = 'none';
    modalCont.style.WebkitAnimationName = null;
    cpuTurn = true;
    game.reset();
    player.resetInput();
    game.generateSequence();
    setTimeout(function() {
      game.playSequence();
    }, 2000);
  }, false);

});
