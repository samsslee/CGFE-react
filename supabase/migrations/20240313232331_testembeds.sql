create extension vector;
create table testembeds (
  id bigserial primary key,
  content text,
  embedding vector (1536)
)