var map = {};

function place_event(x, y, type, spec, name) {
  if (type == "intersection" && spec.length==2) {
    name = "TURN";
  }

  let e = {
    name: name||type.toUpperCase(),
    type: type,
    spec: spec,
    x: x,
    y: y,
    distance: undefined,
    stops_car: true,
  };

  if (type == "intersection" || type == "crosswalk") {
    e.stops_car = false;
  }

  if (type == "crosswalk") {
    e.active = false;
    e.guys = [];
    e.time = 0;
    e.update = function() {
      this.time += delta;
      if (this.time < 10000) { //ten seconds of green light
        this.active = false;
        this.light_label.textContent = "green light, free to pass the crosswalk";
      } else if (this.time < 15000) {
        this.active = false;
        this.light_label.innerHTML = "<b>yellow</b> light on the crosswalk!";
      } else if (this.time < 25000) {
        this.active = true;
        this.light = "RED";
        this.light_label.innerHTML = "<b>!!! PEOPLE ARE CROSSING THE STREET !!!</b>";
        if (this.guys.length <= 0) {
          for (let i=0; i<Math.random()*3+2; i++) {
            if (Math.random() < .5) {
              this.guys.push(print("guy", 0, 65 + Math.random() * 20, null, "cross-left", this.div));
            } else {
              this.guys.push(print("guy", 100, 65 + Math.random() * 20, null, "cross-right", this.div));
            }
          }
        }
      } else if (this.time >= 30000) {
        this.active = false;
        this.time = 0;
        this.light = "GREEN";
        this.light_label.textContent = "green light, free to pass the crosswalk";
        for (let i=this.guys.length-1; i>=0; i--) {
          this.guys[i].remove();
        }
        this.guys=[];
      }
    };
    e.div = document.createElement("div");
    e.div.classList.add("hidden");
    scene.appendChild(e.div);
    e.light_label = print("uhh", 50, 50, null, null, e.div);
  }

  map[x+"_"+y] = e;
}

function initialize_map() {
  place_event(0, 0, "home");
  place_event(0, -2, "crosswalk");
  place_event(0, -3, "intersection", "SE");
  place_event(3, -3, "intersection", "NWE");
  place_event(4, -3, "crosswalk");
  place_event(5, -3, "gas", null, "GAS STATION");
  place_event(3, -4, "crosswalk");

  place_event(3, -9, "intersection", "SW");
  place_event(1, -9, "intersection", "SE");
  place_event(1, -8, "intersection", "NE");
  place_event(2, -8, "intersection", "NW");
  place_event(2, -10, "intersection", "SE");

  place_event(7, -10, "intersection", "NW"); // -> dump gas
  place_event(7, -12, "intersection", "NSW");
  place_event(2, -12, "intersection", "NE");
  place_event(2, -13, "crosswalk");
  place_event(2, -16, "crosswalk");
  place_event(2, -17, "intersection", "SW");
  place_event(-1, -17, "dump");
  place_event(7, -14, "intersection", "SWE");
  place_event(6, -14, "crosswalk");
  place_event(5, -14, "gas", null, "GAS STATION");

  place_event(9, -14, "intersection", "SW");
  place_event(9, -8, "intersection", "NSE");
  place_event(9, -7, "crosswalk");
  place_event(9, -6, "gas", null, "GAS STATION");

  place_event(11, -8, "intersection", "NWE"); //curvy town
  place_event(12, -8, "intersection", "SW");
  place_event(12, -7, "intersection", "NE");
  place_event(13, -7, "intersection", "SW");
  place_event(13, -6, "intersection", "NE");
  place_event(14, -6, "intersection", "NW");
  place_event(14, -7, "intersection", "SE");
  place_event(15, -7, "intersection", "SW");
  place_event(15, -6, "intersection", "NSE");

  place_event(15, -5, "intersection", "NW");
  place_event(14, -5, "intersection", "SE");
  place_event(14, -4, "intersection", "NE");
  place_event(16, -4, "crosswalk");
  place_event(17, -4, "intersection", "SW");
  place_event(17, -3, "hideout");

  place_event(16, -6, "crosswalk");
  place_event(19, -6, "crosswalk");
  place_event(20, -6, "intersection", "NW");
  place_event(20, -8, "station", null, "POLICE STATION");

  place_event(11, -12, "intersection", "SE");
  place_event(13, -12, "intersection", "SW");
  place_event(13, -11, "intersection", "NE");
  place_event(14, -11, "intersection", "NWE");

  place_event(15, -11, "crosswalk");
  place_event(16, -11, "gas", null, "GAS STATION");

  place_event(14, -17, "intersection", "SW");
  place_event(10, -17, "intersection", "NE");
  place_event(10, -20, "crosswalk");
  place_event(10, -22, "end", null, "THE END OF THE ROAD");
}