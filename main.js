var inputfields = {
  "1": document.getElementById("input1"),
  "2": document.getElementById("input2"),
};
var scene = document.getElementsByClassName("scene")[0];
var mapimage = document.getElementsByClassName("map")[0];

var stat_elements = {
  "gas": document.getElementById("gas"),
  "speed": document.getElementById("speed"),
  "damage": document.getElementById("damage"),
  "weapon": document.getElementById("weapon"),
  "clothes": document.getElementById("clothes"),
  "win": document.getElementById("win"),
  "compass": document.getElementById("compass"),
};

var todelete = [];

function print(text, x, y, duration_in_seconds, classname, parent) {
  var span = document.createElement("span");
  span.innerHTML = text;
  span.style.left = x+"%";
  span.style.top = y+"%";
  span.className = classname || "";

  if (classname=="banner") {
    clear_banner();
  }

  parent = parent || scene;
  parent.appendChild(span);

  if (duration_in_seconds) {
    span.dataset.duration = duration_in_seconds * 1000;
    todelete.push(span);
  }

  return span;
}

function clear_banner() {
  let prevbanner = document.getElementsByClassName("banner");
  if (prevbanner.length > 0) {
    prevbanner = prevbanner[0];
    prevbanner.remove();
  }
}

async function arrayprint(array) {
  for (let line of array) {
    print(line.text, line.x||0, line.y||0, line.duration, line.classname);
    await new Promise(res => setTimeout(res, (line.duration||0) * 1000 + 50));
  }
}

input1.addEventListener("keydown", function (e) {
  setTimeout(function(){ keydown(1) }, 1);

  if (e.key === 'Enter') {
    command(1);
    input1.value = "";
    input1.classList.remove("highlight");
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    // setTimeout(function() { input2.focus(); }, 1);
    input2.focus();
  }
});

input2.addEventListener("keydown", function (e) {
  setTimeout(function(){ keydown(2) }, 1);

  if (e.key === 'Enter') {
    command(2);
    input2.value = "";
    input2.classList.remove("highlight");
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    input1.focus();
  }
});

function keydown(char) {
  let input = inputfields[char];
  var value = input.value.trim().toLowerCase();

  if (value in characters[char].commands) {
    input.classList.add("highlight");
  } else {
    input.classList.remove("highlight");
  }
}

function print_speech(char, text, duration_in_seconds) {
  let min = char==1 ? 65 : 20;
  if (duration_in_seconds==null) duration_in_seconds = 1.4;
  return print(text, min + Math.random() * 15, 100, duration_in_seconds, "speechbubble");
}

function command(char) {
  let input = inputfields[char];
  var value = input.value.trim().toLowerCase();
  if (value=="") return;

  if (value in characters[char].commands) {
    if (player.game_started) {
      characters[char].commands[value]();
    } else {
      if (char==1) print_speech(char, "get in the CAR!!!");
      if (char==2) print_speech(char, "gotta get in the CAR");
    }
  } else {
    print_speech(char, value);
  }
}

var prevtime = 0;
var delta;

function animate() {
  delta = performance.now() - prevtime;
  prevtime = performance.now();

  for (let i=todelete.length-1; i>=0; i--) {
    let el = todelete[i];
    el.dataset.duration -= delta;
    if (el.dataset.duration <= 0) {
      el.remove();
      todelete.splice(i, 1);
    }
  }

  update();

  requestAnimationFrame(animate);
}

function milliseconds_to_time(ms) {
  var totalseconds = Math.floor(ms / 1000);
  var seconds = totalseconds % 60;
  var minutes = Math.floor(totalseconds / 60);

  if (seconds < 10) seconds = "0"+seconds;

  var time = minutes+":"+seconds;

  return time;
}

function clear_all() {
  for (let i=todelete.length-1; i>=0; i--) {
    let el = todelete[i];
    el.remove();
    todelete.splice(i, 1);
  }
}

function vector_to_cardinal(vec) {
  if (vec.y == -1) return "N";
  if (vec.y == 1) return "S";
  if (vec.x == 1) return "E";
  if (vec.x == -1) return "W";
}

var _colors = [
  {
    "prompt": "☪",
    "--bg": "#f0f4f7",
    "--text": "#182026",
    "--highlight": "red",
  },
  {
    "prompt": "☀",
    "--bg": "#181b1e",
    "--text": "#ced8e0",
    "--highlight": "#eba4ff"
  }
];
let _theme = -1;
function toggle_theme() {
  _theme++;
  if (_theme >= _colors.length) _theme = 0;

  let theme = _colors[_theme];
  let properties = Object.keys(theme);

  for (let property of properties) {
    document.documentElement.style.setProperty(property, theme[property]);
  }

  document.getElementById("themebutton").textContent = theme.prompt;
}
toggle_theme();

update_gas(Math.round(player.gas));
update_damage(0);

initialize_map();
animate();