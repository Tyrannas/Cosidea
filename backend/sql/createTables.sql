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
    "recif_id" INTEGER REFERENCES "recif"("id") ON DELETE CASCADE NOT NULL
);

CREATE TABLE "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(15) NOT NULL,
    "recif_id" INTEGER REFERENCES "recif"("id") ON DELETE CASCADE NOT NULL,
    UNIQUE ("recif_id", "name")
);

CREATE TABLE "corail_tag_rel" (
    "corail_id" INTEGER REFERENCES "corail"("id") ON DELETE CASCADE NOT NULL ,
    "tag_id" INTEGER REFERENCES "tag"("id") ON DELETE CASCADE NOT NULL ,
    PRIMARY KEY("corail_id", "tag_id") 
);
