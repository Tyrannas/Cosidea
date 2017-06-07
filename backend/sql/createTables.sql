CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name"  VARCHAR(30) NOT NULL,
  "hash" VARCHAR(60) NOT NULL
);

CREATE TABLE "recif" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) UNIQUE,
    "description" TEXT,
    "isProtected" BOOLEAN,
    "hash" VARCHAR(60),
    "owner" INTEGER REFERENCES "user"("id")
);

CREATE TABLE "corail" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "recif_id" INTEGER REFERENCES "recif"("id") NOT NULL
);

CREATE TABLE "alge" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(15) NOT NULL,
    "recif_id" INTEGER REFERENCES "recif"("id") NOT NULL,
    UNIQUE ("recif_id", "name")
);

CREATE TABLE "corail_alge_rel" (
    "corail_id" INTEGER REFERENCES "corail"("id") NOT NULL,
    "alge_id" INTEGER REFERENCES "alge"("id") NOT NULL,
    PRIMARY KEY("corail_id", "alge_id") 
);


