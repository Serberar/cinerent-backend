-- Se conservan solo los cuatro últimos dígitos de la tarjeta
ALTER TABLE "users" RENAME COLUMN "cardNumber" TO "cardLast4";
UPDATE "users" SET "cardLast4" = RIGHT("cardLast4", 4);
