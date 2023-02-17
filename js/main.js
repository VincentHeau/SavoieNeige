/***************************************************************************/
/************************************************ CREATION DE LA CARTE *****/
/***************************************************************************/

const width = 1500, height = 1000;

const map = d3.geoPath();

const projection = d3.geoMercator()
	.center([5.7, 45.9])
	.scale(20000)
	//.translate([width/2, height/2]);

map.projection(projection);

// Ajout d'une image SVG portant l'id svg1 à l'élement HTML qui porte l'id carte

const svg = d3.select("#carte")
	.append("svg")
	.attr("id", "svg1")
	.attr("width", "100%")
	.attr("height", "100%");

/***************************************************************************/
/*********************************** AJOUTER DES OBJETS SUR LES CARTES *****/
/***************************************************************************/


// Ajout d'un groupe (depts) au SVG (svg)

const depts = svg.append("g");

depts.selectAll("path")
	// La variable geojson_communes est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_depts.features)
	.enter()
	.append("path")
	.attr("d", map)
	// Sémiologie (par défaut) des objets
	.style("fill", "white")
	.style("stroke-width", 0);

// Ajout de tuiles Mapbox

let tiles = d3.tile()
	.size([width, height])
	.scale(projection.scale() * 2 * Math.PI)
	.translate(projection([0, 0]))
();
svg.selectAll("image")
	.data(tiles)
	.enter().append("image")
	.attr("xlink:href", function(d) { return "https://api.mapbox.com/styles/v1/adrienvh/ckwxen4ncgq4715p2090xoeik/tiles/256/" + d[2] + "/" + d[0] + "/" + d[1] + "?access_token=pk.eyJ1IjoiYWRyaWVudmgiLCJhIjoiU2lDV0N5cyJ9.2pFJAwvwZ9eBKKPiOrNWEw"; })
	.attr("x", function(d) { return (d[0] + tiles.translate[0]) * tiles.scale; })
	.attr("y", function(d) { return (d[1] + tiles.translate[1]) * tiles.scale; })
	.attr("width", tiles.scale)
	.attr("height", tiles.scale);


// Ajout d'un groupe (station) au SVG (svg)

const stations = svg.append("g").attr("id", "stations");
var x = "h2021"
//console.log(geojson_stations.features[0]);
stations.selectAll("circle")
    .data(geojson_stations.features)
    .join("circle")
    .attr("cx", d => projection(d.geometry.coordinates)[0])
    .attr("cy", d => projection(d.geometry.coordinates)[1])
    .attr("r", r => 15*r.properties[x])
    .attr("fill-opacity", 0.5)
    .attr("fill", "black")
    .attr("stroke", "red");
// Ajout d'un groupe (villes) au SVG (svg)


// Logs the value when the user has released the slider
$('#curseur').on('change', function(){
	x = "h" + $('#curseur').val().toString();

	stations.selectAll("circle")
		.data(geojson_stations.features)
		.join("circle")
		.attr("cx", d => projection(d.geometry.coordinates)[0])
		.attr("cy", d => projection(d.geometry.coordinates)[1])
		.attr("r", r => 15*r.properties[x])
		.attr("fill-opacity", 0.5)
		.attr("fill", "black")
		.attr("stroke", "red");
});



const villes = svg.append("g");

villes.selectAll("path")
	// La variable geojson_villes est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_villes.features)
	.enter()
	.append("path")
	.attr("d", map)
	// Sémiologie (par défaut) des objets
	.style("fill", "#fff4d9")
	.style("stroke-width", 0);

// Ajout d'un groupe (roads) au SVG (svg)

const roads = svg.append("g");

roads.selectAll("path")
	// La variable geojson_roads est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_roads.features)
	.enter()
	.append("path")
	.attr("d", map)
	.style("fill-opacity", 0)
	.style("stroke-width", function(d){
		if (d.properties.fclass == "cycleway") {
			return 3;
		} else {
			return 1;
		}
	})
	.style("stroke", function(d){
		if (d.properties.fclass == "cycleway") {
			return "#70db37";
		} else {
			return "#cfcfcf";
		}
	});

// Ajout d'un groupe (pois) au SVG (svg)

const pois = svg.append("g");

const points = [
	{ lettre: "A", nom: "Phare de St-Clément-des-Baleines", coords: [-1.56117, 46.24417] },
	{ lettre: "B", nom: "Plage de Trousse-Chemise", coords: [-1.4757478658554912, 46.23193816882479] },
	{ lettre: "C", nom: "Citadelle de St-Martin-de-Ré", coords: [-1.3587753499702593, 46.20459328764373] },
	{ lettre: "D", nom: "Abbaye des Châteliers", coords: [-1.2975098032225931, 46.18575345435855] },
	{ lettre: "E", nom: "Plage du Groin", coords: [-1.41602, 46.22702] }
];

pois.selectAll("circle")
	.data(points)
	.enter()
	.append("circle")
	.attr("cx", function (d){return projection(d.coords)[0];})
	.attr("cy", function (d){return projection(d.coords)[1];})
	.attr("r", "7px")
	.attr("fill", "orange")
	.style("stroke", "#db6a00")
	.style("stroke-width", 2);

// Ajouter les POIs en légende

for (const point of points) {
	$("#pois").append(`<p>${point.lettre}. ${point.nom}</p>`)
}

// Ajout d'un groupe (lettresPois) au SVG (svg)

const lettresPois = svg.append("g");

lettresPois.selectAll("text")
	// On peut réutiliser la même variable points pour un second groupe
	.data(points)
	.enter()
	.append("text")
	.attr("x", function(d) {
		return projection(d.coords)[0];
	})
	.attr("y", function(d) {
		return projection(d.coords)[1];
	})
	.attr('dx', -4)
	.attr('dy', 4)
	.attr("fill", "#db6a00")
	.style("font-size", "11px")
	.style("font-weight", "bold")
	.style("font-family", "Bitter")
	.text(function(d){
		return d.lettre
	});

// Ajout d'un groupe (labelsPois) au SVG (svg)

const labelsPois = svg.append("g");

labelsPois.selectAll("text")
	// On peut réutiliser la même variable points pour un second groupe
	.data(points)
	.enter()
	.append("text")
	.attr("x", function(d) {
		return projection(d.coords)[0];
	})
	.attr("y", function(d) {
		return projection(d.coords)[1];
	})
	.attr('dx', 13)
	.attr('dy', 7)
	.attr("fill", "black")
	.style("text-anchor", "right")
	.style("font-size", "20px")
	.style("font-weight", "bold")
	.style("font-family", "Bitter")
	.text(function(d){
		return d.nom
	});

	///  Création du graphique en bar

const ctx = document.getElementById('myChart');
const arrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => "Février "+ (start + index * step).toString()
    );
let range = arrayRange(1996,2022, 1);


var labels =[];
var valeurs = []
 for (var i = 0; i < geojson_stations.features.length; i++) {
	labels.push(geojson_stations.features[i].properties.Nom)
	valeurs.push(geojson_stations.features[i].properties.h2020);
  }

 

 var config = {
	type: 'line',
	data: {
	   labels: labels,
	   datasets: [{
		  label: 'Graph Line',
		  data: valeurs,
		  backgroundColor: 'rgba(0, 119, 204, 0.3)'
	   }]
	}
 };
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '# of Votes',
        data: valeurs,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });