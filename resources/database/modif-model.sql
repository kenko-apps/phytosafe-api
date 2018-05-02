#alimentaire
alter table formulaire add column cafe bool;
alter table formulaire add column the bool;
alter table formulaire add column reglisse bool;
alter table formulaire add column soja bool;
alter table formulaire add column pamplemousse bool;
alter table formulaire add column pomelo bool;
alter table formulaire add column orange bool;
alter table formulaire add column cranberry bool;

#durée depuis diagnostique
alter table formulaire add column duree_maladie varchar;

#TODO à retirer en vérifiant que ces colomnes ne sont pas créées avant
alter table formulaire drop column aliments;
alter table formulaire drop column fruits;