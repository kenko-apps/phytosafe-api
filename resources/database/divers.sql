
--- donner tous les droits sur une base à un utilisateur
GRANT ALL PRIVILEGES ON SCHEMA public TO s;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO s;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO s;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO s;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO s;


--- supprimer et recreer un schéma
DROP schema public CASCADE;
CREATE schema public;