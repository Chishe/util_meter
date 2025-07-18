const { PrismaClient } = require('@prisma/client');
const nodeCrypto = require('crypto');

const prisma = new PrismaClient();

function md5(text: string): string {
  return nodeCrypto.createHash('md5').update(text).digest('hex');
}
async function main() {
  console.log('Start seeding...');

  await prisma.user.create({
    data: {
      username: 'admin',
      password: md5('admin'),
    },
  });

  // PowerMeter ตัวอย่าง
  await prisma.powerMeter.createMany({
    data: [
      {
        treatment_pond: 100.5,
        wastewater_pump_building1: 50.2,
        wastewater_pump_building2: 48.7,
        recorded_at: new Date('2025-07-01T10:00:00Z'),
      },
      {
        treatment_pond: 110.1,
        wastewater_pump_building1: 52.3,
        wastewater_pump_building2: 49.9,
        recorded_at: new Date('2025-07-02T10:00:00Z'),
      },
    ],
  });

  // WaterMeter ตัวอย่าง
  await prisma.waterMeter.createMany({
    data: [
      {
        water_in: 1200,
        water_out: 1150,
        recorded_at: new Date('2025-07-01T00:00:00Z'),
      },
      {
        water_in: 1250,
        water_out: 1175,
        recorded_at: new Date('2025-07-02T00:00:00Z'),
      },
    ],
  });

  // BuildingWaterMeter ตัวอย่าง
  await prisma.buildingWaterMeter.createMany({
    data: [
      {
        air_cooling_water_building2: 300,
        water_usage_building2: 290,
        reused_treated_water: 100,
        drinking_water: 50,
        air_cooling_water_building1: 280,
        water_usage_building1: 275,
        recorded_at: new Date('2025-07-01T00:00:00Z'),
      },
      {
        air_cooling_water_building2: 320,
        water_usage_building2: 295,
        reused_treated_water: 105,
        drinking_water: 52,
        air_cooling_water_building1: 290,
        water_usage_building1: 280,
        recorded_at: new Date('2025-07-02T00:00:00Z'),
      },
    ],
  });

  // MonthlyValue ตัวอย่าง
  await prisma.monthlyValue.createMany({
    data: [
      { value: 123.45, tag: 'temperature' },
      { value: 67.89, tag: 'humidity' },
    ],
  });

  // ValueThreshold ตัวอย่าง
  await prisma.valueThreshold.createMany({
    data: [
      { max: 300, min: 200, colorMax: '#ff0000', colorMin: '#ff0000', tag: 'บ่อบำบัด' },
      { max: 300, min: 200, colorMax: '#ff0000', colorMin: '#ff0000', tag: 'บ่อสูบน้ำเสียอาคาร 1' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำออก' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำใช้อาคาร 2' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'บ่อสูบน้ำเสียอาคาร 2' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำเข้า' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำแอร์รังผึ้งอาคาร 2' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำบำบัดกลับมาใช้ใหม่' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำดื่ม' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำแอร์รังผึ้งอาคาร 1' },
      { max: 300, min: null, colorMax: '#ff0000', colorMin: null, tag: 'น้ำใช้อาคาร 1' }
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });