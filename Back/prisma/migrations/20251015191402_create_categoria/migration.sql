/*
  Warnings:

  - You are about to drop the column `tipo` on the `Denuncia` table. All the data in the column will be lost.
  - Added the required column `idCategoria` to the `Denuncia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Denuncia" DROP COLUMN "tipo",
ADD COLUMN     "idCategoria" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
