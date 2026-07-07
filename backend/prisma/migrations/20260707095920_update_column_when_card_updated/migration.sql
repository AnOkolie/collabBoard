-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_column_id_fkey";

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
