-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'HOST', 'ADMIN');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('DESTINATION', 'EXPERIENCE', 'BLOG');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "lastRequest" BIGINT NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "years" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "imageKey" TEXT NOT NULL DEFAULT 'tara-hike',

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceRsd" INTEGER NOT NULL DEFAULT 0,
    "priceUnit" TEXT NOT NULL DEFAULT 'osoba',
    "duration" TEXT NOT NULL,
    "groupSize" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL DEFAULT 'tara-hike',
    "imageUrl" TEXT,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "toBring" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "itinerary" JSONB NOT NULL DEFAULT '[]',
    "translation" JSONB,
    "meetingPoint" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerId" TEXT,
    "hostId" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "capacity" INTEGER NOT NULL,
    "priceRsd" INTEGER,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "translation" JSONB,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","tourId")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,
    "departureId" TEXT,
    "participants" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_key_key" ON "RateLimit"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_slug_key" ON "HostProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_userId_key" ON "HostProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_name_key" ON "Destination"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_status_category_destinationId_idx" ON "Tour"("status", "category", "destinationId");

-- CreateIndex
CREATE INDEX "Tour_ownerId_idx" ON "Tour"("ownerId");

-- CreateIndex
CREATE INDEX "Departure_tourId_startsAt_idx" ON "Departure"("tourId", "startsAt");

-- CreateIndex
CREATE INDEX "Review_tourId_idx" ON "Review"("tourId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- CreateIndex
CREATE INDEX "Content_status_type_idx" ON "Content"("status", "type");

-- CreateIndex
CREATE INDEX "Inquiry_tourId_createdAt_idx" ON "Inquiry"("tourId", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_userId_createdAt_idx" ON "Inquiry"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostProfile" ADD CONSTRAINT "HostProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "HostProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_departureId_fkey" FOREIGN KEY ("departureId") REFERENCES "Departure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
