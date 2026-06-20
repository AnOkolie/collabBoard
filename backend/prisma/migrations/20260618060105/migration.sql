/*
  Warnings:

  - You are about to drop the `user_friendships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_friendships" DROP CONSTRAINT "fk_friend";

-- DropForeignKey
ALTER TABLE "user_friendships" DROP CONSTRAINT "fk_request_sender";

-- DropForeignKey
ALTER TABLE "user_friendships" DROP CONSTRAINT "fk_user";

-- DropTable
DROP TABLE "user_friendships";

-- CreateTable
CREATE TABLE "friendship_requests" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "friend_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendship_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friendship_requests_user_id_friend_id_key" ON "friendship_requests"("user_id", "friend_id");

-- AddForeignKey
ALTER TABLE "friendship_requests" ADD CONSTRAINT "friendship_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship_requests" ADD CONSTRAINT "friendship_requests_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
