CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name"  VARCHAR(30) NOT NULL,
  "pass_hash" VARCHAR(60) NOT NULL
);

CREATE TABLE "project" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(30) UNIQUE,
    "description" TEXT,
    "isProtected" BOOLEAN,
    "hash" VARCHAR(60),
    "owner" INTEGER REFERENCES "user"("id")
);

CREATE TABLE "idee" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "project_id" INTEGER REFERENCES "project"("id") NOT NULL
);

CREATE TABLE "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(15) NOT NULL
);

CREATE TABLE "idee_tag_rel" (
    "idee_id" INTEGER REFERENCES "idee"("id") NOT NULL,
    "tag_id" INTEGER REFERENCES "tag"("id") NOT NULL,
    PRIMARY KEY("idee_id", "tag_id") 
);


