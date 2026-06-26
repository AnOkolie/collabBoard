/*
  Warnings:

  - You are about to alter the column `file_size` on the `attachments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Changed the type of `message_type` on the `messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "message_type" AS ENUM ('user', 'system');

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "file_size" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "message_type",
ADD COLUMN     "message_type" "message_type" NOT NULL;

-- DropEnum
DROP TYPE "message_types";
