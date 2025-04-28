import { personIcon } from "./constant.js";
import { getNoteIcon, getStatus } from "./helper.js";
import elements from "./ui.js";


// * Global Variables

let clickedCoords;
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layer;
let map;

console.log(notes);

window.navigator.geolocation.getCurrentPosition(
  
  (e) => {
    loadMap([e.coords.latitude, e.coords.longitude], "Mevcut Konum");
  },
  
  (e) => {
    loadMap([39.924655, 32.836576], "Varsayılan Konum");
  }
);

// ! Harita oluşturan fonksiyon

function loadMap(currentPosition, message) {

  map = L.map("map", { zoomControl: false }).setView(currentPosition, 10);

  
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {

    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);



  L.control.zoom({ position: "bottomright" }).addTo(map);

  
  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(message);

  
  layer = L.layerGroup().addTo(map);

 
  map.on("click", onMapClick);

  
  renderNotes();

  
  renderMarkers();
}

// ! Harita üzerinde tıklanma olayı gerçekleşince çalışacak fonksiyon
function onMapClick(e) {
  
  clickedCoords = [e.latlng.lat, e.latlng.lng];

  
  elements.aside.classList.add("add");
}

// ! Cancel Btn'e tıklayınca aside kısmını eski haline çeviren fonksiyon
elements.cancelBtn.addEventListener("click", () => {
  elements.aside.classList.remove("add");
});

// ! Form gönderildiğinde çalışacak fonksiyon

elements.form.addEventListener("submit", (e) => {
 
  e.preventDefault();

  
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;


  const newNote = {
   
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: clickedCoords,
  };

  
  notes.push(newNote);

 
  localStorage.setItem("notes", JSON.stringify(notes));

  
  e.target.reset();

  
  elements.aside.classList.remove("add");

 
  renderNotes();

 
  renderMarkers();
});


function renderNotes() {
 
  const noteCards = notes
    .map((note) => {
      
      const date = new Date(note.date).toLocaleDateString("tr", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return ` <li>
        <div>
          <p>${note.title}</p>
          <p>${date}</p>
          <p>${getStatus(note.status)}</p>
        </div>
        <div class="icons">
          <i data-id='${note.id}' class="bi bi-airplane-fill" id="fly-btn"></i>
          <i data-id='${note.id}' class="bi bi-trash" id="delete-btn"></i>
        </div>
      </li>`;
    })
    .join("");

  
  elements.noteList.innerHTML = noteCards;

  
  document.querySelectorAll("#delete-btn").forEach((btn) => {
    
    const id = btn.dataset.id;
    btn.addEventListener("click", () => {
     
      deleteNote(id);
    });
  });

 
  document.querySelectorAll("#fly-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
     
      const id = btn.dataset.id;

     
      flyToNote(id);
    });
  });
}

// ! Silme işlemi yapan fonksiyon

function deleteNote(id) { 
  const response = confirm("Not silme işlemini onaylıyor musunuz ?");

  if (response) {
  
    notes = notes.filter((note) => note.id != id);

    
    localStorage.setItem("notes", JSON.stringify(notes));

   
    renderNotes();

   
    renderMarkers();
  }
}


function flyToNote(id) {
 
  const foundedNote = notes.find((note) => note.id == id);

  map.flyTo(foundedNote.coords, 11);
}

function renderMarkers() {
 
  layer.clearLayers();
  
  notes.map((note) => {
    const icon = getNoteIcon(note.status);
    
    L.marker(note.coords, { icon }).addTo(layer);
  });
}

elements.arrowIcon.addEventListener("click", () => {
  elements.aside.classList.toggle("hide");
});
