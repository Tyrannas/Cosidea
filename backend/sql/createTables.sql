CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name"  VARCHAR(30) NOT NULL,
  "hash" VARCHAR(60) NOT NULL
);

CREATE TABLE "project" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(30) UNIQUE,
    "description" TEXT,
    "isProtected" BOOLEAN,
    "hash" VARCHAR(60),
    "owner" INTEGER REFERENCES "user"("id")
);

CREATE TABLE "idea" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "project_id" INTEGER REFERENCES "project"("id") NOT NULL
);

CREATE TABLE "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(15) NOT NULL,
    "project_id" INTEGER REFERENCES "project"("id") NOT NULL,
    UNIQUE ("project_id", "name")
);

CREATE TABLE "idea_tag_rel" (
    "idea_id" INTEGER REFERENCES "idea"("id") NOT NULL,
    "tag_id" INTEGER REFERENCES "tag"("id") NOT NULL,
    PRIMARY KEY("idea_id", "tag_id") 
);


