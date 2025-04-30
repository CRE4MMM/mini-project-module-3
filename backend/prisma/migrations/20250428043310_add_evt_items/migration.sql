/*
  Warnings:

  - You are about to drop the `EventItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EventItem";

-- CreateTable
CREATE TABLE "EvtItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availableSeats" INTEGER NOT NULL,

    CONSTRAINT "EvtItem_pkey" PRIMARY KEY ("id")
);
