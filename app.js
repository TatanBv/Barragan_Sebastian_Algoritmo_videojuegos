// Lista base de videojuegos
let videojuegos = [
  { nombre: "The Legend of Zelda: Ocarina of Time", puntos: 0 },
  { nombre: "Super Mario Bros.", puntos: 0 },
  { nombre: "Minecraft", puntos: 0 },
  { nombre: "Dark Souls", puntos: 0 },
  { nombre: "The Witcher 3", puntos: 0 },
  { nombre: "Red Dead Redemption 2", puntos: 0 },
  { nombre: "Tetris", puntos: 0 },
  { nombre: "Half-Life 2", puntos: 0 }
];

let actualA, actualB;

// Elegir dos videojuegos distintos al azar
function nuevaComparacion() {
  let indices = [...videojuegos.keys()].sort(() => Math.random() - 0.5);
  actualA = videojuegos[indices[0]];
  actualB = videojuegos[indices[1]];

  document.getElementById("optionA").innerText = actualA.nombre;
  document.getElementById("optionB").innerText = actualB.nombre;
}

// Registrar voto
function vote(opcion) {
  if (opcion === "A") {
    actualA.puntos++;
  } else {
    actualB.puntos++;
  }

  actualizarRanking();
  nuevaComparacion();
}

// Mostrar ranking ordenado
function actualizarRanking() {
  let ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  let ordenados = [...videojuegos].sort((a, b) => b.puntos - a.puntos);

  ordenados.forEach(juego => {
    let li = document.createElement("li");
    li.innerText = `${juego.nombre} (${juego.puntos} pts)`;
    ranking.appendChild(li);
  });
}

// Iniciar
nuevaComparacion();
actualizarRanking();
