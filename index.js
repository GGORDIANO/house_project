class House {
constructor(name) {  //where the name of the house will go//

this.name = name;
this.rooms = [];
}


addRoom(name, area) {
this.rooms.push(new Room(name, area));  // method to add a room, to add new rooms to the array.

}
}


class Room {
constructor(name, area) {
this.name = name;
this.area = area;
}
}

// We create a class to interact with the API for managing the houses
class HouseService {
static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses'; //root url for all the end points were going to call in the api



static getAllHouses() {
return $.get(this.url);  // going to return all the houses, will return Jquery and all the houses from this URL

}


static getHouse(id) {  // will get id of the specific house we wan to retrieve from the API

return $.get(this.url + `/${id}`);
}


static createHouse(house) { //what is meant by (house) is an instance of our house class so it will take something that has a name then an array

return $.post(this.url, house);
}


static updateHouse(house) {
return $.ajax({
url: this.url + `/${house._id}`,  // _id because that's the value that the database will automatically create for our house

dataType: 'json',
data: JSON.stringify(house),
contentType: 'application/json',
type: 'PUT'
})
}

// method to delete house by it's ID via the API 
static deleteHouse(id) {
return $.ajax({
url: this.url + `/${id}`,
type: 'DELETE'
});
}


}


class DOMManager {
static houses;


static getAllHouses() {  // this method is going to call the getallhouses method inside of our service and then render them to DOM

HouseService.getAllHouses().then(houses => this.render(houses));
}


static createHouse(name) {
HouseService.createHouse(new House(name))
.then(() => {
return HouseService.getAllHouses();
})
.then((houses) => this.render(houses));
}




static deleteHouse(id) {
console.log(id)
HouseService.deleteHouse(id) // once we delete a house, we want to render
.then(() => {
return HouseService.getAllHouses();
})
.then((houses) => this.render(houses));
}


static addRoom(id) {
for (let house of this.houses) {
if (house._id == id) {
house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()))
HouseService.updateHouse(house)
.then(() => {
return HouseService.getAllHouses();
})
.then((houses) => this.render(houses));
}
}
}


static deleteRoom(houseId, roomId) {
for (let house of this.houses) {
if (house._id == houseId) {
for (let room of house.rooms) {
if (room._id == roomId) {
console.log("house" + house)
console.log("room" + room)
house.rooms.splice(house.room.indexOf(room), 1);
HouseService.updateHouse(house)
.then(() => {
return HouseService.getAllHouses();
})
.then((houses) => this.render(houses));
}
}
}
}
}


static render(houses) {
this.houses = houses;
$('#app').empty();
for (let house of houses) {
$('#app').prepend(
`<div id="${house._id}" class="card">
<div class="card-header">
<h2>${house.name}</h2>
<button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
</div>


<div class="card-body">
<div class="card">
<div class="row">
<div class="col-sm">
<input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
</div>
<div class="col-sm">
<input type="text" id="${house._id}-room-area" class="form-control" placeholder="Room Area">
</div>
</div>




<button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>


</div>
</div>


</div><br>`


);


for (let room of house.rooms) {
$(`#${house._id}`).find('.card-body').append(
`<p>
<span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
<span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
<button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Rooms</button>
`
)
}


}
}
}


$('#create-new-house').click(() => {
DOMManager.createHouse($('#new-house-name').val());
$('#new-house-name').val('');
});


DOMManager.getAllHouses();
  
  
  
  
  