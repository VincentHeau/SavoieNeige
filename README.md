# Carte dynamique de l'enneigement dans les stations savoyardes

_Ce site a été créé pour un projet de classe consistant à réaliser une cartographie dynamique via les outils de programmation web._

## Table des matières
1. [Descriptif du site](##Descriptif du site)

2. [Principales améliorations nécessaires](##3)

      2.1 [Ajustement de la légende](###2.1)

      2.2 [Design du graphique en barres verticales](###2.2)

      2.3 [Graphique général](###2.3)

      2.4 [Autres possibilités envisagées pour compléter le site](###2.4)

      2.5 [Amélioration du css](###2.5)


3. [Données utilisés](##4)

4. [Versions](##5)

5. [Auteurs](##6)


## 1.Descriptif de la page

Cette page a pour but de représenter *l'enneigement moyen pour le mois de février, des principales stations de sports d'hiver des départements de Savoie (73) et Haute Savoie (74), depuis 1996 jusqu'à 2022*. On retrouve ici 3 éléments principaux se complétant afin de visualiser au mieux cette donnée :

- Une carte interactive du massif des Alpes, représentant à l'aide de cercles proportionnels la hauteur de neige en mètre pour chaques stations. Cette carte est accompagnée de sa légende en bas à droite de la page.
- Un graphique en barres représentant, dans l'ordre décroissant pour l'année choisie, les stations selon leurs hauteur de neige moyenne en février.
- Un graphique en courbe, accessible en cliquant sur l'année en haut à droite de la page. Celui ci représente la moyenne cumulée des hauteurs de neige de toutes les stations pour les mois de février de chaque année.

Afin de faire varier l'année, un slider est disponible en bas de page, possédant aussi un mode de défilement automatique en cliquant sur le bouton _play/pause_ situé à sa droite. 

![Aperçu du site](/img/site.png "Aperçu du site")


## 2.Principales améliorations nécessaires

> La plupart des fonctionnalitées dont les implémentations ont été réfléchies en amont du projet ont réussi à être implémentées dans cette version finale. Nous pouvons cependant réfléchir à d'autres pistes d'améliorations qui font l'objet de cette partie.

### 2.1 Ajustement de la légende
![Modifications nécessaires de la légende](/img/legende.png "Modifications nécessaires de la légende"| width=200)
### 2.2 Design du graphique en barres verticales

### 2.3 Graphique général
![Connection du graphique au mouvement du temps](/img/suivi.png "Connection du graphique au mouvement du temps" | width=200)
### 2.4 Autres possibilités envisagées pour compléter le site

### 2.5 Amélioration du css



## 3.Données utilisées

Pour les couches de départements :
* [BD TOPO](www.ign.fr)

Pour les données nivologiques :
* [Météo France](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=94&id_rubrique=32)

## 4. Versions
1

## 5. Auteurs
* **Vincent HEAU** [VincentHeau](https://github.com/VincentHeau)
* **Matthieu Ahr** [TFillon](https://github.com/MatthieuAhr)
