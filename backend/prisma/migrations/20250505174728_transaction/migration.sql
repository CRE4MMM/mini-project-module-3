-- CreateTable
CREATE TABLE "EventTransaction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "evtItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventTransaction" ADD CONSTRAINT "EventTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTransaction" ADD CONSTRAINT "EventTransaction_evtItemId_fkey" FOREIGN KEY ("evtItemId") REFERENCES "EvtItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
