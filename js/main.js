/***************************************************************************/
/************************************************ CREATION DE LA CARTE *****/
/***************************************************************************/

const width = 1500, height = 1000;

///  Création du graphique en bar
var ctx = document.getElementById('myChart');


function creation_graph(x){

	var dict = {};
	for (var i = 0; i < geojson_stations.features.length; i++) {
		var key = geojson_stations.features[i].properties.Nom;
		var val = geojson_stations.features[i].properties[x];
		dict[key] = val;
	}

	// Fonction pour trier
	function sort_object(obj) {
		items = Object.keys(obj).map(function(key) {
			return [key, obj[key]];
		});
		items.sort(function(first, second) {
			return second[1] - first[1];
		});
		sorted_obj={}
		$.each(items, function(k, v) {
			use_key = v[0]
			use_value = v[1]
			sorted_obj[use_key] = use_value
		})
		return(sorted_obj)
	} 


	// On tri le dictionnaire
	var sortedArrayOfObj = sort_object(dict);


	// On crée les listes triées
	newArrayLabel = [];
	newArrayData = [];

	for (const sta in sortedArrayOfObj) {
		newArrayLabel.push(`${sta}`);
		newArrayData.push(`${sortedArrayOfObj[sta]}`);
	}
	

	// Création du graph

	var config = {
		type: 'line',
		data: {
		labels: newArrayLabel,
		datasets: [{
			label: 'Graph Line',
			data: newArrayData,
			backgroundColor: 'rgba(0, 119, 204, 0.3)'
		}]
		}
	};
	
	try{ graph2.destroy()}
	catch{}
	graph2 = new Chart(ctx, {
		type: 'bar',
		data: {
		labels: newArrayLabel,
		datasets: [{
			label: '# of Votes',
			data: newArrayData,
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
	return graph2
}

function maj_graph(x,graph){

	var dict = {};
	for (var i = 0; i < geojson_stations.features.length; i++) {
		var key = geojson_stations.features[i].properties.Nom;
		var val = geojson_stations.features[i].properties[x];
		dict[key] = val;
	}

	// Fonction pour trier
	function sort_object(obj) {
		items = Object.keys(obj).map(function(key) {
			return [key, obj[key]];
		});
		items.sort(function(first, second) {
			return second[1] - first[1];
		});
		sorted_obj={}
		$.each(items, function(k, v) {
			use_key = v[0]
			use_value = v[1]
			sorted_obj[use_key] = use_value
		})
		return(sorted_obj);
	} 


	// On tri le dictionnaire
	var sortedArrayOfObj = sort_object(dict);


	// On crée les listes triées
	newArrayLabel = [];
	newArrayData = [];

	for (const sta in sortedArrayOfObj) {
		newArrayLabel.push(`${sta}`);
		newArrayData.push(`${sortedArrayOfObj[sta]}`);
	}
	

	// Mise à jour du graphe
	graph.data.labels = newArrayLabel;
	graph.data.datasets[0].data = newArrayData;
    // chart.data.datasets.forEach((dataset) => {
    //     dataset.data.pop();
    // });
    graph.update('none');
	
}



graph2 = creation_graph("h2022");
maj_graph("h2000",graph2);

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

/// Création de l'animation
var play = false;

$(".bouton").click(function() {
    play = !play;
	console.log(play);
	if (play){
		console.log("lancer l'animation");

		// Initialisation à 1996
		creation_graph("h1996");
		creation_stations("h1996");
		$("#curseur").val(1996);

		// lancement de l'animation
		// program to display a text using setInterval method
		// program to stop the setInterval() method after five times

		let annee = 1996;

		var x = "h" + annee;
			
		var h_moy_neige = calculateAverage(x);

		$(".box_info_annee").text(annee);
		$(".box_info_neige").text(h_moy_neige + " m");
		
		// function creation
		var interval = setInterval(function(){
			// increasing the count by 1
			annee += 1;
		
			// when count equals to 5, stop the function
			if(annee == 2022 || play==false){
				clearInterval(interval);
			}
			maj_graph("h"+annee.toString(),graph2);
			creation_stations("h"+annee.toString());
			$("#curseur").val(annee);

			var x = "h" + annee;
			
			var h_moy_neige = calculateAverage(x);

			$(".box_info_annee").text(annee);
			$(".box_info_neige").text(h_moy_neige);
		
		}, 1200);
	}
	else{
		try{clearInterval(interval)}
		catch{}
	}
	

  });

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
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
var x = "h2021";

function creation_stations(x){
	stations.selectAll("circle")
    .data(geojson_stations.features)
    .join("circle")
	.attr("Nom", d => d.properties.Nom)
	.attr("hmoy",d => (Math.round(100*d.properties[x])/100).toString())
    .attr("cx", d => projection(d.geometry.coordinates)[0])
    .attr("cy", d => projection(d.geometry.coordinates)[1])
    .attr("r", r => 15*r.properties[x])
    .attr("fill-opacity", 0.5)
    .attr("fill", "black")
    .attr("stroke", "red");


	stations.selectAll("circle")
		.on("mouseover", function(e){
			var Nom = e.srcElement.getAttribute("Nom");
			var hmoy = e.srcElement.getAttribute("hmoy");
			e.srcElement.style.cursor = "pointer";
			e.srcElement.setAttribute("fill","red");
			tooltip
				.style("display", "block");
			tooltip
				.transition().duration(200).style("opacity", 0.9);
			tooltip
				.html("<b>"+Nom+"</b><br>Hauteur moyenne : <b>"+hmoy+" m</b>")
				.style("left", (e.pageX + 10) + "px")
				.style("top", (e.pageY - 10) + "px");
		})
		.on("mouseout", function(d){
			tooltip.style("left", "-500px").style("top", "-500px");
			d.srcElement.setAttribute("fill","black");
		});

	
}
creation_stations("h2022");

// Ajout d'un groupe (villes) au SVG (svg)


// Au mouvement du curseur
$('#curseur').on('change', function(){
    
	var annee = $('#curseur').val().toString();
	x = "h" + annee;
    
	var h_moy_neige = calculateAverage(x);

	$(".box_info_annee").text(annee);
    $(".box_info_neige").text(h_moy_neige+" m");
	// Mise à jour des cercles
	creation_stations(x)

	// Mise à jour du graphe 2
	creation_graph(x);

	//Mise à jour du graph1
	// graph1.series[0].options.marker = 
	// {
	// 	fillColor: 'red',
	// 	lineWidth: 2,
	// 	lineColor: Highcharts.getOptions().colors[0]
	// }
	//graph1.update()

});



function calculateAverage(annee) {

	var total = 0;
    var count = 0;

	for (var i = 0; i < geojson_stations.features.length; i++) {
		count +=1;
		total += parseFloat(geojson_stations.features[i].properties[annee]);
	}
    return Math.round(100*total / count)/100;
}

function calculateMinMax(annee) {

	var min = parseFloat(geojson_stations.features[0].properties[annee]);
	var max = parseFloat(geojson_stations.features[0].properties[annee]);

	for (var i = 1; i < geojson_stations.features.length; i++) {
		h = parseFloat(geojson_stations.features[i].properties[annee]);
		if (h<min){
			min = h;
		}
		if (h>max){
			max = h;
		}
	}

    return [Math.round(100*min)/100,Math.round(100*max)/100];
}


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



var ranges = create_averages();
var averages = create_avg()

function create_avg(){
	// Créer la table des valeurs moyennes
	var tab_average = []
	for (var i = 1996; i < 2023; i++) {
		var annee = "h"+i.toString();
		tab_average.push(calculateAverage(annee));
	}

    return tab_average;
}

function create_averages(){
	// Créer la table des valeurs moyennes
	var tab_average = []
	for (var i = 1996; i < 2023; i++) {
		var annee = "h"+i.toString();
		tab_average.push(calculateMinMax(annee));
	}

    return tab_average;
	
}

console.log(create_avg());
console.log(create_averages());

var a = 1
var graph1 = new Highcharts.chart('container', {

chart: {
	// Edit chart spacing
	spacingBottom: 0,
	spacingTop: 0,
	spacingLeft: 0,
	spacingRight: 0,
	// Explicitly tell the width and height of a chart
	width: null,
	height: 220,
	backgroundColor: "none"
},

title: {
	text: 'Hauteur moyenne de neige dans les sations savoyardes en février',
	align: 'left'
},

subtitle: {
	text: 'Source: ' +
		'<a href="https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=94&id_rubrique=32"' +
		'target="_blank">Météo France</a>',
	align: 'left'
},

xAxis: {
	type: 'datetime',
	accessibility: {
		rangeDescription: 'De février 1996 à février 2022'
	}
},

yAxis: {
	title: {
		text: null
	}
},

tooltip: {
	crosshairs: true,
	shared: true,
	valueSuffix: 'm'
},

plotOptions: {
	series: {
		pointStart: Date.UTC(1996, 2),
		pointIntervalUnit: 'year'
	}
},

series: [{
	name: 'Hauteur de neige',
	data: averages,
	zIndex: 1,
	marker: {
		fillColor: a==1 ? "white" : "orange",
		lineWidth: 2,
		lineColor: Highcharts.getOptions().colors[0]
	}
}, {
	name: 'Range',
	data: ranges,
	type: 'arearange',
	lineWidth: 0,
	linkedTo: ':previous',
	color: Highcharts.getOptions().colors[0],
	fillOpacity: 0.3,
	zIndex: 0,
	marker: {
		enabled: false
	}
}]
});


const player = document.querySelector('.fake-player');

function clickHandler () { 
    const buttons = Array.from(this.children);
    buttons.forEach(button => button.classList.toggle('hidden'))
};

player.addEventListener('click', clickHandler);