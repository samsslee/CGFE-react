create extension vector;
create table testembeds (
  id bigserial primary key,
  content text,
  embedding vector (1536)
)
create or replace function match_testembeds (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    testembeds.id,
    testembeds.content,
    1 - (testembeds.embedding <=> query_embedding) as similarity
  from testembeds
  where testembeds.embedding <=> query_embedding < 1 - match_threshold
  order by testembeds.embedding <=> query_embedding
  limit match_count;
$$;

CREATE OR REPLACE FUNCTION create_resume_entry_test(
    position_title VARCHAR,
    company_name VARCHAR,
    start_date DATE, 
    end_date DATE,
    description TEXT,
    embeddings vector(1536)[]
)
RETURNS BOOLEAN AS $$
DECLARE
    success BOOLEAN := TRUE;
    temp_resume_entry_id INT;
    i INT;
BEGIN
    -- Insert into the first table
    INSERT INTO resume_entries (position_title, company_name, start_date, end_date, description) 
    VALUES (position_title, company_name, start_date, end_date, description) 
    RETURNING id INTO temp_resume_entry_id;

    -- Loop through the arrays of descriptions and embeddings and insert each one separately
    FOR i IN 1..array_length(embeddings, 1) LOOP
        INSERT INTO resume_description_embeddings (resume_entry_id, test) 
        VALUES (temp_resume_entry_id, embeddings[i]::vector);
    END LOOP;

    -- Return success
    RETURN success;
END;
$$ LANGUAGE plpgsql;