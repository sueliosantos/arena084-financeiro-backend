-- CreateTable
CREATE TABLE "itens_compra" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "comprado" BOOLEAN NOT NULL DEFAULT false,
    "preco" DECIMAL(12,2),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "itens_compra_comprado_idx" ON "itens_compra"("comprado");
