/*
  Warnings:

  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hash",
ADD COLUMN     "password" TEXT,
ALTER COLUMN "phone" SET NOT NULL;
