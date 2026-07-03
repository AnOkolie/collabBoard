/*
  Warnings:

  - You are about to drop the column `direct_conversation_key` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conversation_id]` on the table `friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conversation_id` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "conversations_direct_conversation_key_key";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "direct_conversation_key";

-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "conversation_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "friends_conversation_id_key" ON "friends"("conversation_id");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
