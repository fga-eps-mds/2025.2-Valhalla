/*
  Warnings:

  - Changed the type of `cargo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CargoUsuario" AS ENUM ('ESTUDANTE', 'SERVIDOR', 'OUTRO');

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "cargo",
ADD COLUMN     "cargo" "CargoUsuario" NOT NULL;
