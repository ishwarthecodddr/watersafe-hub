import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const john = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: { email: 'john@example.com', name: 'John Doe' }
  });

  const reportsCount = await prisma.report.count();
  if (reportsCount === 0) {
    await prisma.report.createMany({
      data: [
        {
          reportCode: 'WS-2025-001',
          location: 'Downtown Lake',
          coordinates: '25.2°N, 89.3°E',
          description: '[discoloration] Unusual water discoloration observed',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          submittedByName: 'Anonymous',
          anonymous: true,
          contactForUpdates: false,
          officialResponse: 'Water testing conducted. Temporary algae bloom, resolved naturally.',
          actionTaken: 'Increased monitoring frequency for 30 days',
          resolvedAt: new Date()
        },
        {
          reportCode: 'WS-2025-002',
          location: 'Industrial District River',
          coordinates: '25.4°N, 89.1°E',
          description: '[pollution] Strong chemical odor and oil sheen on water surface',
          status: 'INVESTIGATING',
          priority: 'CRITICAL',
          submittedByName: 'John Doe',
          submittedByEmail: 'john@example.com',
          anonymous: false,
          contactForUpdates: true,
          officialResponse: 'Investigation ongoing. Industrial facility inspections scheduled.',
          actionTaken: 'Water access restricted, source investigation in progress'
        },
        {
          reportCode: 'WS-2025-003',
          location: 'Residential Well Area',
          coordinates: '25.1°N, 89.5°E',
          description: '[taste] Metallic taste in drinking water',
          status: 'PENDING',
          priority: 'HIGH',
          submittedByName: 'Jane Smith',
          submittedByEmail: 'jane@example.com',
          anonymous: false,
          contactForUpdates: true,
          officialResponse: 'Report received and logged for review.',
          actionTaken: 'Pending initial assessment'
        }
      ]
    });
  }
  console.log('Seed data inserted.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
