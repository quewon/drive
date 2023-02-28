var config = {
  area_radius: .35,
}

var player = {
  game_started: false,
  position: { x:0, y:-config.area_radius },
  speed: "slow",
  moving: false,
  direction: { x:0, y:-1 },
  needs_direction: false,
  direction_change_counter: 0,
  next_direction: { x:0, y:-1 },
  time: 1000*60 * 20,
  gas: 4.4,
  damage: 0,
  ran_into_wall: false,
  gameover: false,

  achievements: {
    weapon: false,
    clothes: false,
  },
  achievement_timers: {
    weapon: 5000,
    clothes: 5000,
  },
  visited_station: false,
};

var characters = {
  "1": {
    sprite: document.getElementById("sprite1"),
    need_to_be_moving: function() {
      let dialogue = [
        "we need to be moving to do that",
        "we should <a>go</a> first"
      ];
      print_speech(1, dialogue[Math.random() * dialogue.length | 0]);
    },
    dont_need_directions: function() {
      let dialogue = [
        "huh?",
        "what",
        "not yet",
        "tell me that later",
        "don't need your directions yet",
      ];
      print_speech(1, dialogue[Math.random() * dialogue.length | 0]);
    },
    turn_confirmation: function(relative_dir) {
      let dialogue = [];
      if (player.direction_change_counter>=3) {
        dialogue = [
          "WHAT. ok "+relative_dir,
          relative_dir+"???",
          "omg ok",
        ];
      } else {
        dialogue = [
          "ok, "+relative_dir,
          relative_dir+", got it",
          relative_dir+"!",
        ];
      }
      print_speech(1, dialogue[Math.random() * dialogue.length | 0]);
      if (player.direction_query_element) player.direction_query_element.remove();
      if (player.intersection_alert) player.intersection_alert.remove();
    },
    turning: function() {
      let dialogue = [
        "gotcha",
        "ok, turning now",
        "OK",
        "we are now turning",
      ];
      print_speech(1, dialogue[Math.random() * dialogue.length | 0]);
      player.direction_change_counter = 0;
    },
    commands: {
      "go": function() {
        if (player.ran_into_wall) {
          print_speech(2, "i should turn around (<a>back</a>) first");
          return;
        }

        player.moving = true;
        characters["1"].sprite.className = "drive1";
        characters["2"].sprite.className = "drive2";
        stat_elements.speed.textContent = "slow";
      },
      "stop": function() {
        this.slow();
        player.moving = false;
        stat_elements.speed.textContent = "unmoving";
        characters["1"].sprite.className = "wait1";
        characters["2"].sprite.className = "wait2";
        if (player.wall_alert) {
          player.wall_alert.remove();
          player.wall_alert = null;
        }
      },
      "slow": function() {
        if (!player.moving) {
          characters["1"].need_to_be_moving();
          return;
        }
        player.speed = "slow";
        stat_elements.speed.textContent = "slow";
        document.documentElement.style.setProperty("--speed", "1s");
      },
      "fast": function() {
        if (!player.moving) {
          characters["1"].need_to_be_moving();
          return;
        }
        player.speed = "fast";
        stat_elements.speed.textContent = "fast";
        document.documentElement.style.setProperty("--speed", "400ms");
      },
      "time": function() {
        print("time left: <b>"+milliseconds_to_time(player.time)+"</b>", 50, 5, 1.5);
        characters["1"].sprite.classList.add("panic1");
        setTimeout(function() {
          characters["1"].sprite.classList.remove("panic1");
        }, 1500);
      },
      "help": function() {
        var ct = 1.7;
        var x = 80;
        var y = 95;
        arrayprint([
          { text: "here are some things the DRIVER can do:", duration: 2, x:x, y:y },
          { text: "<a>time</a> to check how long you have", duration: ct, x:x, y:y },
          { text: "<a>go</a> to make the CAR go", duration: ct, x:x, y:y },
          { text: "<a>stop</a> when youre about to hit someone", duration: ct, x:x, y:y },
          { text: "<a>fast</a> for when ur running outta time", duration: ct, x:x, y:y },
          { text: "<a>slow</a> for when ur taking it slow", duration: ct, x:x, y:y },
          { text: "thats it good luck. <a>help</a> to read this again", duration: 2.5, x:x, y:y }
        ]);
      }
    }
  },
  "2": {
    music_iterator: 0,
    dump_murder_weapon: function() {
      if (player.achievement_timers.weapon > 0) {
        player.achievement_timers.weapon -= delta;
        print("dumping the weapon...", 50, 50, .01);
        return;
      }

      if (player.achievements.weapon) return;

      stat_elements.weapon.textContent="☑";
      player.achievements.weapon = true;

      print("errand complete", 50, 50, 1);
    },
    get_new_clothes: function() {
      if (player.achievement_timers.clothes > 0) {
        player.achievement_timers.clothes -= delta;
        print("getting clothes and things...", 50, 50, .01);
        return;
      }

      if (player.achievements.clothes) return;

      stat_elements.clothes.textContent="☑";
      player.achievements.clothes = true;

      print("errand complete", 50, 50, 1);
    },
    visit_station: function() {
      if (player.visited_station) return;

      player.visited_station = true;
      print_speech(2, "???", 3);
      print_speech(1, "what are we doing here", 3);
    },
    sprite: document.getElementById("sprite2"),
    commands: {
      "left": function() {
        if (!player.needs_direction) {
          characters["1"].dont_need_directions();
          return;
        }
        player.next_direction = {
          x: player.direction.y,
          y: -player.direction.x
        };
        player.intersection_alert.remove();
        player.direction_change_counter++;
        characters["1"].turn_confirmation("left");
        characters["2"].sprite.classList.add("turn2");
        setTimeout(function() {
          characters["2"].sprite.classList.remove("turn2");
        }, 1500);
      },
      "right": function() {
        if (!player.needs_direction) {
          characters["1"].dont_need_directions();
          return;
        }
        player.next_direction = {
          x: -player.direction.y,
          y: player.direction.x
        };
        player.intersection_alert.remove();
        player.direction_change_counter++;
        characters["1"].turn_confirmation("right");
        characters["2"].sprite.classList.add("turn2");
        setTimeout(function() {
          characters["2"].sprite.classList.remove("turn2");
        }, 1500);
      },
      "back": function() {
        if (player.ran_into_wall) {
          player.ran_into_wall = false;
        }

        player.direction = {
          x: -player.direction.x,
          y: -player.direction.y
        };
        player.next_direction = {
          x: player.direction.x,
          y: player.direction.y
        };
        characters["1"].turning();

        if (player.crosswalk) {
          player.crosswalk.div.classList.toggle("hidden");
        }
      },
      "map": function() {
        mapimage.classList.toggle("hidden");
        if (mapimage.classList.contains("hidden")) {
          characters["2"].sprite.className = "drive2";
        } else {
          characters["2"].sprite.className = "map2";
        }
      },
      "music": function() {
        let music = [
          {
            title: "latest pop hits",
            doc_title: "Drive~",
            link: "https://youtu.be/oftolPu9qp4"
          },
          {
            title: "the beatles",
            doc_title: "Drive My Car",
            link: "https://youtu.be/Man4Xw8Xypo"
          },
          {
            title: "nice relaxing ambient music for a nice relaxing trip",
            doc_title: "d r i v e",
            link: "https://youtu.be/Jx7CyMZVhHY"
          },
          {
            title: "no it's not just video game music, it's good music in its own right",
            doc_title: "drive",
            link: "https://youtu.be/2JsYHpiH2xs",
          },
          {
            title: "letsa go",
            doc_title: "YOSHI VALLEY",
            link: "https://youtu.be/-Js49GdidVk",
          },
          {
            title: "so... when does the music start",
            doc_title: "drive | rain sounds | 24 hours",
            link: "https://youtu.be/SnUBb-FAlCY",
          },
          {
            title: "",
            link: "",
            doc_title: "DRIVE!!!",
          }
        ];

        let title = music[characters["2"].music_iterator].title;
        let link = music[characters["2"].music_iterator].link;
        document.title = music[characters["2"].music_iterator].doc_title;

        if (this.music_object) this.music_object.remove();
        characters["2"].music_iterator++;
        if (characters["2"].music_iterator >= music.length) characters["2"].music_iterator = 0;

        if (title == "") return;

        let dialogue = [
          "hmm",
          "what about this",
          "lala",
          ":)",
        ];
        print_speech(2, dialogue[Math.random() * dialogue.length | 0]);

        this.music_object = print("now playing: <a target='_blank' href='"+link+"'>"+title+"</a><br>", 100, 5, null);
        this.music_object.classList.add("music_object");
      },
      "help": function() {
        var ct = 1.7;
        var x = 20;
        var y = 95;
        arrayprint([
          { text: "here are some things the KILLER can do:", duration: 2, x:x, y:y },
          { text: "<a>map</a> to toggle the map", duration: ct, x:x, y:y },
          { text: "<a>left</a> and <a>right</a> at curved roads", duration: ct, x:x, y:y },
          { text: "to tell the DRIVER where to go", duration: ct, x:x, y:y },
          { text: "<a>back</a> to turn around", duration: ct, x:x, y:y },
          { text: "<a>music</a> to put some tunes on", duration: ct, x:x, y:y },
          { text: "thats it good luck. <a>help</a> to read this again", duration: 2.5, x:x, y:y }
        ]);
      }
    }
  },
};

//

function update_gas(value) {
  if (value <= 0) gameover("YOU RAN OUT OF GAS.");

  let text = "";
  for (let i=0; i<5; i++) {
    if (i<value) {
      text += "■";
    } else {
      text += "□";
    }
  }

  text += " ("+["empty", "needs refill", "waning", "ok", "plenty", "full"][value]+")";

  stat_elements.gas.textContent = text;
}

function update_damage(value) {
  if (value >= 3) gameover("YOUR CAR IS IN SHAMBLES.");

  text = Math.ceil(value/3 * 100)+"% ("+["pristine", "not so hot", "rickety", "done for"][value]+")";

  stat_elements.damage.textContent = text;
}

function init() {
  input1.focus();
  input1.onblur = function(e) {
    setTimeout(function() { input2.focus(); }, 1);
  }
  input2.onblur = function(e) {
    setTimeout(function() { input1.focus(); }, 1);
  }

  update_distance_to_events();

  print("each character has different text commands. type <a>help</a> to learn about them!", 50, 87, 5);

  player.game_started = true;
}

function update_distance_to_events() {
  for (let key in map) {
    let e = map[key];
    let a = e.x - player.position.x;
    let b = e.y - player.position.y;
    e.distance = Math.sqrt(a*a + b*b);
  }
}

function update() {
  if (!player.game_started) return;

  player.time -= delta;
  if (player.time <= 0) {
    gameover("YOU RAN OUT OF TIME...");
    return;
  }

  for (let key in map) {
    let e = map[key];
    if (e.update) {
      e.update();
    }
  }

  if (player.moving && player.gas > 0 && player.damage < 3) {
    var speed = { "slow":.0001, "fast":.0002 }[player.speed] * delta;

    let prev_gas = player.gas;
    player.gas -= speed / 15;
    let fgas = Math.round(player.gas);
    if (Math.round(prev_gas) != fgas) {
      update_gas(fgas);
    }

    var move = {
      x: player.direction.x * speed,
      y: player.direction.y * speed
    };

    player.position.x += move.x;
    player.position.y += move.y;

    step();
  } else { // we are not moving
    for (let key in map) {
      let e = map[key];
      if (e.distance <= config.area_radius) {
        print("you are at: "+e.name, 0, 0, .5, "banner");
        if (e.type == "gas") {
          if (player.gas == 5) {
            print("gas tank full!", 50, 50, .001);
          } else {
            player.gas += .01;
            print("filling up gas.......", 50, 50, .001);
            if (player.gas > 5) player.gas = 5;
            update_gas(Math.round(player.gas));
          }
        } else if (e.type == "dump") {
          characters["2"].dump_murder_weapon();
        } else if (e.type == "hideout") {
          characters["2"].get_new_clothes();
        } else if (e.type == "station") {
          characters["2"].visit_station();
        } else if (e.type == "end" && !player.gameover) {
          gamewin();
        }
      }
    }
  }
}

function step() {
  update_distance_to_events();
  let facing = [];
  let leaving;
  for (let key in map) {
    let e = map[key];

    let dir_to_event = {
      x: (e.x - player.position.x)/e.distance,
      y: (e.y - player.position.y)/e.distance
    };

    let dot = dir_to_event.x * player.direction.x + dir_to_event.y * player.direction.y;

    if (dot == 1) {
      facing.push(e);
    } else if (dot == -1 && e.distance <= config.area_radius) {
      leaving = e;
    }
  }

  let closest_distance = Infinity;
  let closest_event = undefined;
  for (let e of facing) {
    if (e.distance < closest_distance) {
      closest_event = e;
      closest_distance = e.distance;
    }
  }
  if (closest_event) {
    if (closest_event.type == "intersection" && closest_event.distance < 1) {
      if (!player.needs_direction) {
        player.intersection_alert = print("<b>"+closest_event.name+" AHEAD</b><br>KILLER, type <a>left</a> / <a>right</a> to give directions!!!<br>type nothing to keep going forward", 50, 50, 0, "blink");
        player.direction_query_element = print_speech(1, "which way?", 0);
        player.needs_direction = true;
      }
      if (closest_event.distance < .1) {
        // make the turn
        player.position = {
          x: closest_event.x,
          y: closest_event.y
        };
        if (player.direction_query_element) player.direction_query_element.remove();
        if (player.intersection_alert) player.intersection_alert.remove();

        // check if turn matches available cardinal directions
        if (closest_event.spec.includes(vector_to_cardinal(player.next_direction))) {
          print("turn successful", 50, 25, 2);
          player.direction = {
            x: player.next_direction.x,
            y: player.next_direction.y
          };
          player.needs_direction = false;
          characters["1"].turning();
        } else {
          // crash
          crash();
          player.needs_direction = true;
          player.direction_query_element = print_speech(1, "which way actually??", 0);
          print_speech(2, "whoops", 3);
          player.intersection_alert = print("<br>KILLER, type <a>left</a> / <a>right</a> to give directions", 50, 20, 0);
        }
      }
    } else {
      if (player.needs_direction) {
        player.needs_direction = false;
        player.direction_change_counter = 0;
        if (player.direction_query_element) player.direction_query_element.remove();
        if (player.intersection_alert) player.intersection_alert.remove();
      }
    }

    if (closest_event.stops_car) {
      if (closest_event.distance <= config.area_radius && !player.wall_alert) {
        player.wall_alert = print("<b>ARRIVED AT STOP</b><br>DRIVER, <a>stop</a> before you hit the wall!", 50, 50, null);
      } else if (closest_event.distance < .1) {
        player.position = {
          x: closest_event.x,
          y: closest_event.y
        };
        crash();
        print_speech(2, "!", 3);
        print_speech(1, "that was a wall", 3);
        player.ran_into_wall = true;
        if (player.wall_alert) {
          player.wall_alert.remove();
          player.wall_alert = null;
        }
      }
    } else {
      if (player.wall_alert) {
        player.wall_alert.remove();
        player.wall_alert = null;
      }
    }

    if (closest_event.type=="crosswalk" && closest_event.distance < 1) {
      if (!player.crosswalk || player.crosswalk != closest_event) {
        player.crosswalk = closest_event;
        closest_event.div.classList.remove("hidden");
      }
      if (closest_event.active && closest_event.distance < .1) {
        player.crosswalk.div.classList.add("hidden");
        player.crosswalk = null;
        crash();
        gameover("YOU HIT THEM :(");
      }

    } else {
      if (player.crosswalk) {
        player.crosswalk.div.classList.add("hidden");
        player.crosswalk = null;
      }
    }

    let vaguedistance = closest_event.distance.toFixed(1);
    let bannertext = "you are approaching: "+closest_event.name+" in "+vaguedistance+"km";
    if (leaving) {
      bannertext = "you are now leaving: "+leaving.name+"<br>"+bannertext;
    }

    print(bannertext, 0, 0, .5, "banner");
  } else {
    player.needs_direction = false;
    player.direction_change_counter = 0;
    if (player.direction_query_element) player.direction_query_element.remove();
    if (player.intersection_alert) player.intersection_alert.remove();
    if (player.wall_alert) {
      player.wall_alert.remove();
      player.wall_alert = null;
    }
  }
}

function crash() {
  characters["1"].commands.stop();
  clear_all();
  print("BOOM", 50, 50, 5, "blink");
  for (let i=0; i<10; i++) {
    setTimeout(function() {
      print(["✧","*","☆"][Math.random()*3|0], Math.random() * 100, Math.random() * 100, 2);
    }, Math.random() * 1000);
  }
  player.damage++;
  update_damage(player.damage);

  //rebound
  player.position.x += -player.direction.x/20;
  player.position.y += -player.direction.y/20;
}

function gameover(message) {
  print(message+"<br>REFRESH TO PLAY AGAIN...", 50, 50);
  player.moving = false;
  player.gameover = true;
}

function gamewin() {
  let text = "... you made it, with "+milliseconds_to_time(player.time)+" to spare.";

  if (!player.achievements.weapon || !player.achievements.clothes) {
    text += "<br>but in your hurry, you forgot about the KILLER's errands.";
  } else {
    text += "<br>and the KILLER and the DRIVER parted ways for good.";
  }

  print(text, 50, 50);
  stat_elements.win.textContent="☑";
  player.gameover = true;
}