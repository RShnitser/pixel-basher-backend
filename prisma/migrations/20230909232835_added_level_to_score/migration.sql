/*
  Warnings:

  - You are about to drop the column `height` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the `UserScore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `levelId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_scoreId_fkey";

-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_userId_fkey";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "height",
DROP COLUMN "width";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "levelId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserScore";

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
