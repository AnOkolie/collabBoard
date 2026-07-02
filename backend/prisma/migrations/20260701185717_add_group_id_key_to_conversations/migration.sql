/*
  Warnings:

  - A unique constraint covering the columns `[group_id_key]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "group_id_key" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_group_id_key_key" ON "conversations"("group_id_key");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_group_id_key_fkey" FOREIGN KEY ("group_id_key") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
