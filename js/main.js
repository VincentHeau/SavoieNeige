/***************************************************************************/
/************************************************ CREATION DE LA CARTE *****/
/***************************************************************************/



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

	
	try{ graph2.destroy()}
	catch{}

	const gradientFill = ctx.getContext("2d").createLinearGradient(500, 0, 100, 0);
	gradientFill.addColorStop(0, "black");
	gradientFill.addColorStop(1, "#B0E0E6");

	graph2 = new Chart(ctx, {
		type: 'bar',
		data: {
		labels: newArrayLabel,
		datasets: [{
			label: 'Hauteur moyenne de neige (en m)',
			data: newArrayData,
			backgroundColor: gradientFill,
			borderWidth: 1
		}]
		},
		options: {
			responsive: true,
    		maintainAspectRatio: false,
			indexAxis: 'y',
			plugins: {
				title: {
					display: true,
					text: 'Classement des stations savoyardes en '+x.slice(1,5)
				}},
		scales: {
			
			y: {
			beginAtZero: true,
			ticks: {
				z: 1,
				mirror: true //Show y-axis labels inside horizontal bars
			}
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
	.center([5.8, 46.3])
	.scale(13000)
	//.translate([width/2, height/2]);

map.projection(projection);

// Ajout d'une image SVG portant l'id svg1 à l'élement HTML qui porte l'id carte

const svg = d3.select("#carte")
	.append("svg")
	.attr("id", "svg1")
	.attr("width", "100%")
	.attr("height", "100%");


const svglegend = d3.select("#boite-outil")
	.append("svg")
	.attr("id", "svg2")
	.attr("hidden", "true")
	.attr("width", "180px")
	.attr("height", "180px");

/// Création de l'animation
var play = false;

$("#play").click(function() {
    play = !play;
	
	if (play){
		$("#play").html("<b>||</b>");

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
				$("#play").html("Play");
			}
			maj_graph("h"+annee.toString(),graph2);
			creation_stations("h"+annee.toString());
			$("#curseur").val(annee);

			var x = "h" + annee;
			
			var h_moy_neige = calculateAverage(x);

			$(".box_info_annee").text(annee);
			$(".box_info_neige").text(h_moy_neige+" m");
		
		}, 1000);
	}
	else{
		$("#play").html("Play");
		try{clearInterval(interval)}
		catch{}
	}
	

  });

/***************************************************************************/
/*********************************** AJOUTER DES OBJETS SUR LES CARTES *****/
/***************************************************************************/

// Définition des hauteurs et largeurs en fonction de la fenêtre de l'utilisateur
// const width = 1500, height = 1000;
var el = document.getElementById("carte");

const width = el.clientWidth;
const height = el.clientHeight;
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

// Ajout des départements

const depts = svg.append("g");

depts.selectAll("path")
	// La variable geojson_roads est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_depts.features)
	.enter()
	.append("path")
	.attr("d", map)
	.style("fill-opacity", 0.4)
	.style("fill", function(d){
		if (d.properties.CODE_DEPT == "74") {
			return "red";
		} else {
			return "orange";
		}
	})
	.style("stroke", "#cfcfcf");
	
	
// Ajout d'un groupe (station) au SVG (svg)


const stations = svg.append("g").attr("id", "stations");
const legende_dessin = svglegend.append("g").attr("id", "dessin_legend");
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
var x = "h2021";

function creation_stations(x){
    
	// Création des cercles proportionnels
	var distribution = []
	for (var i = 0; i < geojson_stations.features.length; i++) {
		var val = geojson_stations.features[i].properties[x];
		console.log(val)
		if (isNaN(val)){
			console.log("gagne")
		}
		distribution.push(val);
	}
	var diametre_min = 10
	var valeur_min = Math.min.apply(Math, distribution.filter(function(n) { return !isNaN(n); }));
	var valeur_max = Math.max.apply(Math, distribution.filter(function(n) { return !isNaN(n); }));
	var valeur_moy = (valeur_max+valeur_min)/2;

	stations.selectAll("circle")
		.data(geojson_stations.features)
		.join("circle")
		.attr("Nom", d => d.properties.Nom)
		.attr("hmoy",d => (Math.round(100*d.properties[x])/100).toString())
		.attr("cx", d => projection(d.geometry.coordinates)[0])
		.attr("cy", d => projection(d.geometry.coordinates)[1])
		.attr("r", r => Math.round((diametre_min / 2) * Math.sqrt(r.properties[x] / valeur_min)))
		.attr("fill-opacity", 0.8)
		.attr("fill", "black")
		.attr("stroke", "white")


	stations.selectAll("circle")
		.on("mouseover", function(e){
			var Nom = e.srcElement.getAttribute("Nom");
			var hmoy = e.srcElement.getAttribute("hmoy");
			e.srcElement.style.cursor = "pointer";
			e.srcElement.setAttribute("fill","white");
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
    
	
	var R2 = Math.round((diametre_min / 2) * Math.sqrt(valeur_moy / valeur_min));
	var R1 = R2/2;
	var R3 = 2*R2;
	console.log(R1);
	var groupe_legende = document.getElementById("dessin_legend")
	while (groupe_legende.firstChild) {
    	groupe_legende.removeChild(groupe_legende.lastChild);
    }
	legende_dessin
		.append("circle")
		.attr("cx", 90)
		.attr("cy", 120)
		.attr("r",R1)
		.attr("fill-opacity", 0.5)
		.attr("fill", "black")
		.attr("stroke", "white")
	
	legende_dessin.append("text")
		.attr("x", 140)
		.attr("y", 120)
		.attr("font-size", "15px")
		.text(R1.toString());
	
    if (R2<60){
		legende_dessin
			.append("circle")
			.attr("cx", 90)
			.attr("cy", 120-(R2-R1))
			.attr("r", R2)
			.attr("fill-opacity", 0.5)
			.attr("fill", "black")
			.attr("stroke", "white")

		legende_dessin.append("text")
			.attr("x", 140)
			.attr("y", 120-2*(R2-R1)-10)
			.attr("font-size", "15px")
			.text(R2.toString());
	}
	
	if (R3<60){
		legende_dessin
			.append("circle")
			.attr("cx", 90)
			.attr("cy", 120-(R3-R1))
			.attr("r",R3)
			.attr("fill-opacity", 0.5)
			.attr("fill", "black")
			.attr("stroke", "white")

		legende_dessin.append("text")
			.attr("x", 140)
			.attr("y", 120-2*(R3-R1)-10)
			.attr("font-size", "15px")
			.text(R3.toString());
	}
	legende_dessin.append("text")
			.attr("x", 10)
			.attr("y", 20)
			.attr("font-size", "15px")
			.text("Hauteur de neige (en m)");


	
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
	height: 350,
	backgroundColor: "rgba(255, 254, 254, 0.727)"
},

title: {
	text: 'Hauteur moyenne de neige dans les stations savoyardes en février',
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



// Afficher/masquer le graph 2
var display = false;

$("#effet").click(function(){
	if (!display){
		display = !display;
		document.getElementById("graph1").removeAttribute("hidden");
		$("#effet").css("background-color", "rgba(150, 2, 12, 0.2)");
	}
	else{
		display = !display;
		document.getElementById("graph1").setAttribute("hidden",true);
		$("#effet").css("background-color", "rgba(150, 150, 150, 0.559)");
	}
	
});

// Afficher/masquer la légende
var display_legende = false;

$("#leg-view").click(function(){
	if (!display_legende){
		display_legende = !display_legende;
		document.getElementById("svg2").removeAttribute("hidden");
		$("#leg-view").text("▲ Légende");
	}
	else{
		display_legende = !display_legende;
		document.getElementById("svg2").setAttribute("hidden",true);
		$("#leg-view").text("▼ Légende");
	}
	
});

// Bouton - source
var displaySource = false;
$("#btn-source").click(function(){
	if (!displaySource){
		displaySource = !displaySource;
		console.log(document.getElementById("source"));
		document.getElementById("source").removeAttribute("hidden");
		$("#btn-source").addClass("active");
	}
	else{
		displaySource = !displaySource;
		document.getElementById("source").setAttribute("hidden", true);
		$("#btn-source").removeClass("active");
	}
});


// Bouton - Politique de confidentialité
var displayPol = false;
$("#btn-pol").click(function(){
	if (!displayPol){
		displayPol = !displayPol;
		console.log(document.getElementById("pol"));
		document.getElementById("pol").removeAttribute("hidden");
		$("#btn-pol").addClass("active");
	}
	else{
		displayPol = !displayPol;
		document.getElementById("pol").setAttribute("hidden", true);
		$("#btn-pol").removeClass("active");
	}
});

// Bouton - Contact
var displayContact = false;
$("#btn-contact").click(function(){
	if (!displayContact){
		displayContact = !displayContact;
		console.log(document.getElementById("contact"));
		document.getElementById("contact").removeAttribute("hidden");
		$("#btn-contact").addClass("active");
	}
	else{
		displayContact = !displayContact;
		document.getElementById("contact").setAttribute("hidden", true);
		$("#btn-contact").removeClass("active");
	}
});

// Bouton - Mentions légales
var displayMention = false;
$("#btn-mention").click(function(){
	if (!displayMention){
		displayMention = !displayMention;
		console.log(document.getElementById("mention"));
		document.getElementById("mention").removeAttribute("hidden");
		$("#btn-mention").addClass("active");
	}
	else{
		displayMention = !displayMention;
		document.getElementById("mention").setAttribute("hidden", true);
		$("#btn-mention").removeClass("active");
	}
});