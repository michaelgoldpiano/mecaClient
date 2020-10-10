var ctx;
function create_image(ctx, src, left, top, width, height) {
  console.log("Creating image \n")
  var img = new Image()
  img.src = src;
  ctx.drawImage(img, left, top, width, height);
}

// Action Buttons
function action_buttons(action_list) {
  console.log("Creating Action Buttons \n")

  let div = document.getElementById('action-buttons-container');
  div.innerHTML = '';

  action_list.forEach(action => {
    let button = document.createElement('button');
    button.innerHTML = action;
    button.classList.add('button')
    button.addEventListener('click', (action) => {
      fetch('', { // your backend URL
        method: 'POST',
        body: {
          'action': action
        }
        // add any other headers and stuff 
      })
    })
    div.appendChild(button)
    // document.body.append(button);
  })
}
// Room Algorithm
function display_rooms(ctx, rooms_dict) {
  console.log("Creating rooms \n")
  //Initialize tracker for visited rooms
  var visited_rooms = {};
  //Initialize first room in position (0, 0)
  var visited_rooms = {
    "room1": [0, 0]
    // "room2" : [0,1]
  };

  // key: room1, room2, ...
  for (key in rooms_dict["rooms"]) {
    //orientations: dictionary of north-of, east-of, ... for each room
    console.log("key: " + key + "\n");
    var orientations = rooms_dict["rooms"][key];

    for (ori_key in orientations) {
      console.log("ori-key: " + ori_key + "\n");
      if (ori_key == "north-of") {
        if (!(orientations[ori_key] in visited_rooms)) {
          visited_rooms[orientations[ori_key]] =
            [visited_rooms[key][0], visited_rooms[key][1] - 1];
        }
      }
      else if (ori_key == "south-of") {
        if (!(orientations[ori_key] in visited_rooms)) {
          visited_rooms[orientations[ori_key]] =
            [visited_rooms[key][0], visited_rooms[key][1] + 1];
        }
      }
      else if (ori_key == "east-of") {
        if (!(orientations[ori_key] in visited_rooms)) {
          visited_rooms[orientations[ori_key]] =
            [visited_rooms[key][0] - 1, visited_rooms[key][1]];
        }
      }
      else if (ori_key == "west-of") {
        if (!(orientations[ori_key] in visited_rooms)) {
          visited_rooms[orientations[ori_key]] =
            [visited_rooms[key][0] + 1, visited_rooms[key][1]];
        }
      }
    }
  }

  console.log(JSON.parse(JSON.stringify(visited_rooms)))
  let total_height = 900;
  let total_width = 1400;
  let x_list = [];
  let y_list = [];
  let x_min = 0;
  let y_min = 0;

  // Extract x and y coords to get grid dimensions
  for (room_keys in visited_rooms) {
    if (!(x_list.includes(visited_rooms[room_keys][0]))) {
      x_list.push(visited_rooms[room_keys][0]);
    }
    if (!(y_list.includes(visited_rooms[room_keys][1]))) {
      y_list.push(visited_rooms[room_keys][1]);
    }
  }

  console.log("x_list: " + x_list + "\n")
  console.log("y_list: " + y_list + "\n")
  // Screen width: 1400, height: 900 with 50 pixel margins
  let room_margin = 50
  let room_width = (total_width - 100) / (x_list.length)
  let room_height = (total_height - 100) / (y_list.length)

  for (const element_x of x_list) {
    if (element_x < x_min) {
      x_min = element_x;
    }
  }

  for (const element_y of y_list) {
    if (element_y < y_min) {
      y_min = element_y;
    }
  }

  // Draw rooms
  for (rooms in visited_rooms) {
    ctx.strokeRect((visited_rooms[rooms][0] - x_min) * room_width + room_margin,
      // Account for top down coordinate system
      (total_height - ((visited_rooms[rooms][1] - y_min) * room_height + room_height)) - room_margin,
      room_width, room_height);

  }
}

function getData() {
  // fetch('', { // put your backend URL
  //   // put your http headers if you need any
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     display_rooms(data.rooms);
  //     action_buttons(data.human_actions);
  //   })

  const data = {
    "rooms": {
      "room1": {
        "north-of": "room2",
      },
      "room2": {
        "south-of": "room1",
        "east-of": "room3",
      },
      "room3": {
        "west-of": "room2",
        "north-of": "room4",
      },
      "room4": {
        "south-of": "room3",
      },
    },
    "human_actions": [
      "wait",
      "open door"
    ]
  }
  action_buttons(data.human_actions);
  display_rooms(ctx, data);

}

function StartScreen(ctx) {
  console.log("in StartScreen \n")

  getData();

  create_image(ctx, 'https://scx2.b-cdn.net/gfx/news/hires/2019/3-robot.jpg',
    200, 300, 50, 60);
  create_image(ctx, 'human.png', 200, 100, 50, 60);
}

function draw() {
  console.log("in draw \n")
  var canvas = document.getElementById('Screen');

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    ctx.strokeRect(0, 0, 1400, 900);
  }
}