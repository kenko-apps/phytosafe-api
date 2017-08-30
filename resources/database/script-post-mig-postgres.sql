-- Scipt à passer sur la base postgres après migration depuis MySql (grâve a Nodejs nmig par exemple) 
-- permettant de supprimer les majuscule sur les noms de tables et de colonnes (la politique pas de majuscule  est préférable sur Postgres)
-- trouvé sur  http://www.postgresonline.com/journal/archives/141-Lowercasing-table-and-column-names.html
-- !! il faut executer les lignes resultats de ces requêtes !! (sur DBeaver par exemple)


-- As David Fetter kindly pointed out, this looks cleaner, returns one record per ddl and is more psql friendly
SELECT  'ALTER TABLE ' || quote_ident(c.table_schema) || '.'
  || quote_ident(c.table_name) || ' RENAME "' || c.column_name || '" TO ' || quote_ident(lower(c.column_name)) || ';' As ddlsql
  FROM information_schema.columns As c
  WHERE c.table_schema NOT IN('information_schema', 'pg_catalog') 
      AND c.column_name <> lower(c.column_name) 
  ORDER BY c.table_schema, c.table_name, c.column_name;


-- lower case table names -- the psql friendly and more reader-friendly way
SELECT 'ALTER TABLE ' || quote_ident(t.table_schema) || '.'
  || quote_ident(t.table_name) || ' RENAME TO ' || quote_ident(lower(t.table_name)) || ';' As ddlsql
  FROM information_schema.tables As t
  WHERE t.table_schema NOT IN('information_schema', 'pg_catalog') 
      AND t.table_name <> lower(t.table_name) 
  ORDER BY t.table_schema, t.table_name;


