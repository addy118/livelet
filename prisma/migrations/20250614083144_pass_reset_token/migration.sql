-- CreateTable
CREATE TABLE "PassResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PassResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassResetToken_token_key" ON "PassResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PassResetToken_email_token_key" ON "PassResetToken"("email", "token");
