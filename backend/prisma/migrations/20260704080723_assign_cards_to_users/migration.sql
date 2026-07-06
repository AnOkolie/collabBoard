-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "assignee" UUID;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_assignee_fkey" FOREIGN KEY ("assignee") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
