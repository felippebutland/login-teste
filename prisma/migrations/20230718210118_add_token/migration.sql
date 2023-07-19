-- CreateTable
CREATE TABLE "Tokens" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
