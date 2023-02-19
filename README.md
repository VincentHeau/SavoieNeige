# Carte dynamique de l'enneigement dans les stations savoyardes

_Ce site a été créé pour un projet de classe consistant à réaliser une cartographie dynamique via les outils de programmation web._

** Commentaire accompagnant le travail **

## Table des matières
1. [Descriptif du site](##1)

2. [Principales améliorations nécessaires](##3)

      2.1 [Ajustement de la légende](###2.1)

      2.2 [Design du graphique en barres verticales](###2.2)

      2.3 [Graphique général](###2.3)

      2.4 [Autres possibilités envisagées pour compléter le site](###2.4)

      2.5 [Amélioration du css et du fond de carte](###2.5)


3. [Données utilisées](##4)

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
Pour voir la légende, il faut cliquer sur un bouton rouge qui permet de l'afficher, puis ensuite de la masquer. Lorsque celle-ci est affichée, elle se construit à partir de la librairie D3 dans un svg de taille 180 px sur 180px. Les cercles construits à l'intérieur sont placés par rapport à ces dimensions.

Pour construire les trois cercles, on récupère **la valeur moyenne de la distribution** et on construit de la même manière que pour le stations un cercle correspondant à cette valeur.
Ensuite, deux autres cercles sont construits. L'un a une aire deux fois moindre et l'autre une aire deux fois supérieure. (cela est illustré sur la figure ci-dessous)

_Cette méthode pose le problème suivants :_

Sa construction sous la forme d'un svg dans une fenêtre pose des problématique d'affichage notamment quand certaines années ont des hauteurs de neige trop importante.

Nous avons fait le choix de ne pas afficher les cercles dépassant de la fenêtre ce qui explique pour certaines années, la légende ne comporte que deux cercles. Ce choix est discustable. Dans l'idéal, nous aurions aimé pouvoir voir quand même la légende en entier avec une fenêtre qui s'agrandisse mais la gestion du css pour faire cette réalisation n'a pas été faite.
Sans faire ce choix, nous aurions eu des cercles tronqués comme le montre l'image ci-dessous.

![Modifications nécessaires de la légende](/img/legende.png "Modifications nécessaires de la légende")
### 2.2 Design du graphique en barres verticales
Dans le site actuel, les barres ont un dégradé tendant vers des nuances de noir pour les barres les plus hautes (stations avec les plus grandes hauteurs de neige).

Dans notre conception première du site, nous avions imaginer de donner un effet de classement. Nous avions comme inspiration les graphiques en vidéos youtube ( [Classement des meilleurs joueurs de tennis de 1997 à 2020](https://youtu.be/jgZSumjsKzg) par exemple).

Pour commencer, nous aurions pu **attribuer une couleurs par station sur le graphique** et utiliser ces couleurs sur la carte.

Ensuite, il aurait fallu coder l'effet de déplacement des bars lors du changement de date, ce qui s'avérait difficile puisque nous utilisons Highchart pour les graphiques.


### 2.3 Graphique général
![Connection du graphique au mouvement du temps](/img/suivi.png "Connection du graphique au mouvement du temps")

Au clic sur le bouton "Voir le graphique complet", un graphique général sur la période de 1996 à nos jours apparaît. Il est statique et non dynamique. Dans notre prototype initial, nous avions envisagé, soit de créer la courbe avec l'animation, ou au moins de pouvoir suivre l'animation sur cette courbe. (voir image ci-dessus)

_Comment l'améliorer ?_

Une possibilité serait de colorer en rouge par exemple le point correspondant à l'année en cours. Lors de l'animation, ce point rouge se déplacerait sur la courbe pour mieux percevoir l'évolution.
Il faudrait aussi, dans ce cas, intégrer le graphique dans la page qui est déjà bien chargée pour le moment.


### 2.4 Autres possibilités envisagées pour compléter le site

Concernant les données, nous aimerions bien travailler avec les données complètes sur l'ensemble des mois depuis 1996. Or, cela nécessite de télécharger et de traiter sous R un grand nombre de tableaux. Un code R présent dans ce git montre comment nous avons agrégé nos données une fois téléchargés et dézipper. Nous voudrions pouvoir automatiser le processus allant du téléchargement jusqu'à la création de données. 

Cela permettrait aussi de penser à la mise à jour annuel du site. D'ici quelques dizaines d'années, la courbe sera sans doute à la baisse et de manière flagrante.

### 2.5 Amélioration du css et du fond de carte

Chaque stations possède une popup qui retranscrit ses informations. Cependant la couche des popup se situe en dessous des éléments d'ahabillage du site. Si la carte déborde sur les éléments d'habillage, alors cette popup ne devient plus cliquable. Il faut gérer cette superposition. D'autre part, il faudrait permettre le zoom sur le fond de carte et ajouter une couche de toponyme. Par manque de temps, nous n'avons pas ajouter au projet de couches de toponymes en GeoJSON. Cela pourrait être intéressant pour mieux lire la carte.  


## 3.Données utilisées

Pour les couches de départements :
* [BD TOPO](www.ign.fr)

Pour les données nivologiques :
* [Météo France](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=94&id_rubrique=32)

## 4. Versions
v1 déployée avec Heroku : [savoieneige](https://savoieneige.herokuapp.com/)

## 5. Auteurs
* **Vincent HEAU** [VincentHeau](https://github.com/VincentHeau)
* **Matthieu Ahr** [MatthieuAhr](https://github.com/MatthieuAhr)
