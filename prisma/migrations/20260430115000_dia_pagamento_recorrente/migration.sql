ALTER TABLE "recorrentes" ADD COLUMN "diaPagamento" INTEGER;

UPDATE "recorrentes"
SET "diaPagamento" = EXTRACT(DAY FROM "dataInicio")::INTEGER;
