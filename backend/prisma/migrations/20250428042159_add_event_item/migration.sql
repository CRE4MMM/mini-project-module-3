-- CreateTable
CREATE TABLE "EventItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availableSeats" INTEGER NOT NULL,

    CONSTRAINT "EventItem_pkey" PRIMARY KEY ("id")
);
