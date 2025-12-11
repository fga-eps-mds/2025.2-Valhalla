/*
  Warnings:

  - Changed the type of `tipo` on the `Noticia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoNoticia" AS ENUM ('GERAL', 'AVISO', 'EVENTO');

-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoNoticia" NOT NULL;
