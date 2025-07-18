-- CreateTable
CREATE TABLE "power_meters" (
    "id" SERIAL NOT NULL,
    "treatment_pond" DOUBLE PRECISION,
    "wastewater_pump_building1" DOUBLE PRECISION,
    "wastewater_pump_building2" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "power_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_meters" (
    "id" SERIAL NOT NULL,
    "water_in" DOUBLE PRECISION,
    "water_out" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building_water_meters" (
    "id" SERIAL NOT NULL,
    "air_cooling_water_building2" DOUBLE PRECISION,
    "water_usage_building2" DOUBLE PRECISION,
    "reused_treated_water" DOUBLE PRECISION,
    "drinking_water" DOUBLE PRECISION,
    "air_cooling_water_building1" DOUBLE PRECISION,
    "water_usage_building1" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "building_water_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_values" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "monthly_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_thresholds" (
    "id" SERIAL NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "colorMax" TEXT NOT NULL,
    "colorMin" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "value_thresholds_pkey" PRIMARY KEY ("id")
);
