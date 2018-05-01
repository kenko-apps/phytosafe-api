#Install Env#

Install the JDK (version 8.x obligatory !!) : http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
Install Android Studio (check case "install android emulator") : https://developer.android.com/studio/index.html
Open a first time Android Studio (this will install some other necessary stuff)
Add env variable ANDROID_HOME with android sdk path and add to path variable theses folders : emulator, tools, platform-tools, build-tools (in this order!)
Go to {Android_SDK}\extras\intel\Hardware_Accelerated_Execution_Manager and install intelhaxm-android.exe
Follow theses instructions to accept licenses : https://stackoverflow.com/questions/40383323/cant-accept-license-agreement-android-sdk-platform-24/40383457#40383457
Install Gradle folowing the instructions of this page : https://gradle.org/install/
Install PostgresSQL : 
Install Git : https://git-scm.com/download/win
Install "Visual studio code" : https://code.visualstudio.com/Download
Open terminal or cmd in admin mode : 
code --install-extension AESSoft.aessoft-class-autocomplete
code --install-extension Angular.ng-template
code --install-extension Thavarajan.ionic2
code --install-extension UVBrain.Angular2
code --install-extension abusaidm.html-snippets
code --install-extension alexiv.vscode-angular2-files
code --install-extension danielehrhardt.ionic3-vs-ionView-snippets
code --install-extension dbaeumer.vscode-eslint
code --install-extension donjayamanne.githistory
code --install-extension doublefint.pgsql
code --install-extension eamodio.gitlens
code --install-extension eg2.tslint
code --install-extension formulahendry.auto-close-tag
code --install-extension formulahendry.auto-rename-tag
code --install-extension jgw9617.ionic2-vscode
code --install-extension joelday.docthis
code --install-extension johnpapa.Angular2
code --install-extension loiane.ionic-extension-pack
code --install-extension msjsdiag.debugger-for-chrome
code --install-extension pkosta2006.rxjs-snippets
code --install-extension robertohuertasm.vscode-icons
code --install-extension steoates.autoimport
code --install-extension vsmobile.cordova-tools
.... TODO update the list

Install Nodejs : https://nodejs.org/en/download/
Update npm : npm install npm@latest -g
Install Angular CLI : npm install -g @angular/cli (insist twice if it doesn't work)
Install Ionic and Cordova : npm install -g ionic cordova
Install gulp CLI : npm install gulp-cli -g

Clone phytosafe-api and phytosafe-app from github

####In phytosafe-api directory :####
- add ".env" file in root directory with "MODE_ENV=development" 
- npm install && gulp --cordova 'prepare'
- gulp
(-change file connection.js with postgres' parameters)

####In phytosafe-app:#### 
- npm install
- ionic serve
(-change file api.ts. put localhost and port 3000, it's what is configured by default in phytosafe.api)
- ionic cordova build android
- correct ionic bug following : https://forum.ionicframework.com/t/error-cannot-read-property-replace-of-undefined-android/93297/11
- ionic cordova emulate android
- To debug, folllow theses instructions : https://www.linkedin.com/pulse/ionic-2-debugging-visual-studio-code-browser-sanjay-jha


##Serveur :##
Install Putty : https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
Install DBeaver : https://dbeaver.jkiss.org/download/ (don't forget to check option "show non default database" at connexion)

##Data Model update tools:##
Install MySQL : https://www.mysql.com/products/community/
Install : PHPMyAdmin : https://www.phpmyadmin.net/   (or whole WampServer if you prefer : http://www.wampserver.com )
Install MySQLWorkbench : https://dev.mysql.com/downloads/workbench/
Install nmig


##Data Model update procedure:##

1) Changer la donnée sur le fichier phytosafe.mwb dans Mysql Workbench
2) File -> Export -> SQL Create Script
3) passer script SQL sur base MySql locale grâce à PHPMYADMIN
4) Supprimer et recréer le schéma public de la base postgres que l'on veut alimenter (voir fichier resources/database/divers.sql)
(Attention cela peut supprimer les droits des utilisateurs qui ne sont pas super user, le script pour réinitialiser les droits est dans le même fichier)
5) paramétrer la migration dans le fichier config.json de nmig (en fonction de si l'on veut alimenter la base postgres locale ou serveur)
6) "npm install" puis "nmp start", repondre Y
7) passer avec Dbeaver le script de correction de la casse sur postgres (resources/database/script-post-mig-postgres.sql) il faut exécuter chacune des 2 fonctions une par une puis exécuter leur résultat respectif.
8) Insérer les données dans la base grâce au script "tout.sql" de Paul
9) C'est bon la base est prête !!
10) Ne pas oublier de commiter le fichier phytosafe.mwb afin que tout le monde ait la nouvelle version 

