-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "actors" TEXT,
ADD COLUMN     "director" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "runtime" TEXT;
