# PhytoSafe : améliorer l'efficacité des traitements anti-cancéreux

PhytoSafe est une application permettant de mettre en évidence les incompatibilités entre les traitements cancéreux prescrits par le médecin et les thérapies alternatives prises par le patient, telles que les phytothérapies et les aromathérapies. Les incompatibilités sont révélées à partir d'un formulaire rempli par le patient.

Ce répertoire Github contient le code source de la partie back-end de l'application PhytoSafe-api, qui est une RESTful API.

## Sommaire

1. [Préalable](#prealable)
2. [Utilisation](#utilisation)
3. [Fonctionnement](#fonctionnement)
4. [Mise en production](#production)

## <a name="prealable"></a>Préalable

PhytoSafe-api utilise plusieurs outils. Ce chapitre décrit les outils utilisés, ainsi que la manière dont PhytoSafe-api a été initialisé. Cette initialisation n'a pas vocation à être reproduite, le code étant déjà écrit. La manière d'utiliser cette application est décrite dans le [chapitre suivant](#utilisation).

### Base de données : PostgreSQL

Le système de gestion de base de données utilisée par PhytoSafe-api est [PostgreSQL](https://www.postgresql.org/), système libre et open source. L'installation locale ou sur un serveur de la base de données est décrite dans le répertoire [resources/database](resources/database).

### Langage serveur : Node.js

Le langage utilisé côté serveur est JavaScript, grâce à la plateforme logicielle libre et évènementielle Node.js. L'installation locale de Node.js se fait par le téléchargement du programme d'installation directement sur le [site](https://nodejs.org/en/download/).

### Framework : Express

PhytoSafe-api utilise l'infrastructure d'applications Web Node.js [Express](http://expressjs.com/), qui permet la création d'une API robuste grâce aux utilitaires HTTP et aux middlewares mis à disposition.
PhytoSafe-api a été créé à partir d'un modèle créé par [Michael Herman](http://mherman.org/), [galvanize-express](https://www.npmjs.com/package/generator-galvanize-express). La configuration de ce modèle est réalisée par l'outil de gestion de modèles [yeoman](http://yeoman.io/). Pour installer yeoman, il faut, une fois node.js installé, lancer la commande :
```bash
npm install -g yo
```
Le modèle comprend [Mocha](https://mochajs.org), [Chai](https://chaijs.org) et [Gulp](https://gulpjs.com). Mocha et Chai permettent de tester le code écrit, et donc l'API. Mocha est un framework de test, tandis que Chai permet de vérifier si des assertions sont vraies ou fausses. Gulp, quant à lui, permet d'automatiser certaines [tâches](https://www.alsacreations.com/tuto/lire/1686-introduction-a-gulp.html). Il peut notamment créer un serveur local. Ces librairies doivent être installées globalement :
```bash
npm install -g mocha chai
npm install -g gulp
```
Pour créer le modèle, il faut d'abord installer globalement le générateur du modèle :
```bash
npm install -g generator-galvanize-express
```
Puis, il faut le configurer grâce à yeoman :
```bash
yo galvanize-express
```
Les noms des projets et de la base de donnée doivent être renseignés, ainsi que le constructeur de requêtes à utiliser ([pg-promise](https://github.com/vitaly-t/pg-promise), [knex](http://knexjs.org) ou aucun des deux). Dans le cas de PhytoSafe-api, pg-promise est utilisé. Une fois le modèle configuré, toutes les dépendances doivent être téléchargées :
```bash
npm install
```

## <a name="utilisation"></a>Utilisation

**Installation des différents outils**

Avant de pouvoir utiliser PhytoSafe-api à partir de ce répertoire GitHub, il faut installer [PostgreSQL](https://www.postgresql.org/), [Node.js](https://nodejs.org/en/) et [Git](https://git-scm.com).
Git est un logiciel de versions décentralisé : il permet de garder la trace des différentes versions apportées au code de PhytoSafe-api et de mettre en évidence chaque modification réalisée. Dans le cas de PhytoSafe-api, chaque modification réalisée est stockée sur ce répertoire GitHub. Avant d'enregistrer une modification dans ce répertoire GitHub, il est nécessaire de parcourir la [documentation Git](https://git-scm.com/docs).

**Lancement de l'application**

Dans un premier temps, il faut cloner ce répertoire GitHub dans un dossier local en lançant la commande, depuis l'emplacement désiré :
```bash
git clone --https://github.com/kenko-apps/phytosafe-api
```

Afin de lancer le serveur localement, il suffit de lancer, depuis le répertoire du projet PhytoSafe-api, la commande suivante :
```bash
gulp
```
ou
```bash
npm start
```
La connexion au serveur depuis un navigateur web est alors disponible à l'adresse : *http://localhost:3000* ou *http://127.0.0.1:3000*.

## <a name="fonctionnement"></a>Fonctionnement

En développement, l'ensemble du code nécessaire au développement se trouve dans le dossier [src](src).
    
### Les différentes routes
Le fichier [route-config.js](src/server/config/route-config.js) définit les deux routes du projet :

* *la page principale de l'API, [index.js](src/server/routes/index.js)*

Cette page présente l'API et est accessible depuis le nom de domaine principal de l'API. Elle affiche une page web dont le code html est dans le dossier [views](src/server/views).

* *les requêtes vers la base de données, [formulaire.js](src/server/routes/formulaire.js)*

Les requêtes sont définies dans le fichier [queriesForm.js](src/server/db/queriesForm.js) et détaillées [ci-dessous](#requetesHTTP).

### La connexion à la base de données
Le fichier [connection.js](src/server/db/connection.js) gère la connection à la base de données PostgreSQL. La connexion à la base de données se fait par l'intermédiaire de [pg-promise](). Il nécessite l'hébergeur, le port, le nom de la base, l'utilisateur et le mot de passe. Ces éléments ne doivent pas être révélés sur GitHub. 
En développement, la base de données à renseigner doit être locale, afin que les requêtes testées ne viennent pas supprimer ou modifier la base de données primaire. Plus d'informations sont données dans le répertoire [resources/database](../resources/database).

###<a name="requeteHTTP"></a> Les requêtes HTTP
Les requêtes HTTP sont écrites dans le fichier [queriesForm.js](src/server/db/queriesForm.js). Chaque requête doit tester les données d'entrée, et renvoyer une erreur si ces données ne correspondent pas au format ou à la valeur attendus. La syntaxe utilisée pour écrire les requêtes avec pg-promise peut être trouvée en suivant ce [lien](https://vitaly-t.github.io/pg-promise/).

### Les tests
Les tests peuvent être réalisés grâce à [Mocha](https://mochajs.org) et [Chai](https://chaijs.org/api). Ils peuvent porter sur le fonctionnement des reqêtes de l'API et seront écrits dans le dossier [test/integration](test/integration) ou sur le fonctionnement d'un contrôleur qui a à sa charge une opération bien définie et et seront alors écrits dans le dossier [test/unit](test/unit). Les tests sont lancés avec la commande :
```bash
mocha
```
ou
```bash
npm test
```

Les tests peuvent être également réalisés manuellement. Si un simple navigateur internet suffit pour les requêtes GET, qui ne font que récupérer des données depuis la base de données, il n'en est pas de même pour les requêtes POST, PUT, PATCH ou DELETE, qui modifient la base de données. Il convient alors d'installer [Curl](curl.haxx.se). Curl permet, depuis un terminal, de tester les requêtes écrites (il convient donc, sous windows, que Curl soit ajouté à la variable d'environnement PATH). Plus d'informations peuvent être trouvées en suivant ce [lien](curl.haxx.se/docs/httpscripting.html).
Un exemple de requête avec des données à envoyer au serveur est :
```bash
curl --data "données_à_envoyer_au_serveur" http://nom_de_domaine_api/nom_requête
```

## <a name="production"></a>Mise en production
autre test
