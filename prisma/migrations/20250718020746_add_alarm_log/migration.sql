-- CreateTable
CREATE TABLE "alarm_log" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alarm_log_pkey" PRIMARY KEY ("id")
);
