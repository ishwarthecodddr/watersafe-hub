import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: { email: 'john@example.com', name: 'John Doe' }
  });

  await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: { email: 'jane@example.com', name: 'Jane Smith' }
  });

  const now = new Date();
  const reports = [
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
      resolvedAt: now
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
    },
    // Additional sample reports for richer map & heat distribution
    { reportCode: 'WS-2025-004', location: 'Coastal Monitoring Site', coordinates: '24.9°N, 88.9°E', description: '[salinity] Elevated salinity levels detected', status: 'PENDING', priority: 'MEDIUM', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-005', location: 'Agricultural Runoff Canal', coordinates: '25.05, 89.42', description: '[nutrient] Possible fertilizer runoff foam', status: 'INVESTIGATING', priority: 'HIGH', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-006', location: 'Urban Drain Outfall', coordinates: '25.18N, 89.27E', description: '[sewage] Unpleasant odor and turbidity spike', status: 'PENDING', priority: 'CRITICAL', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-007', location: 'Mountain Spring Source', coordinates: '26.1°N, 88.7°E', description: '[clarity] Source clarity reduced after rains', status: 'RESOLVED', priority: 'LOW', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false, resolvedAt: now, actionTaken: 'Debris cleared at spring mouth' },
    { reportCode: 'WS-2025-008', location: 'Floodplain Pond', coordinates: '25.7, 89.55', description: '[algae] Rapid algal bloom coverage', status: 'INVESTIGATING', priority: 'MEDIUM', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-009', location: 'Industrial Effluent Channel', coordinates: '25.33°N, 89.05°E', description: '[chemical] Persistent chemical sheen observed', status: 'INVESTIGATING', priority: 'CRITICAL', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-010', location: 'Irrigation Well Cluster', coordinates: '25.12, 89.61', description: '[metal] Elevated iron taste reported by farmers', status: 'PENDING', priority: 'HIGH', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-011', location: 'School Handpump', coordinates: '25.09N, 89.48E', description: '[odor] Slight sulfur smell during morning usage', status: 'PENDING', priority: 'MEDIUM', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-012', location: 'Community Tank', coordinates: '25.25°N, 89.34°E', description: '[contamination] Suspended particles after cleaning', status: 'RESOLVED', priority: 'LOW', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false, resolvedAt: now, actionTaken: 'Filtration mesh replaced' },
    { reportCode: 'WS-2025-013', location: 'Wetland Reserve', coordinates: '25.47, 89.12', description: '[biodiversity] Fish mortality cluster', status: 'INVESTIGATING', priority: 'HIGH', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-014', location: 'Fishing Jetty', coordinates: '24.98N, 89.22E', description: '[oil] Tar-like residue on nets', status: 'PENDING', priority: 'MEDIUM', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false },
    { reportCode: 'WS-2025-015', location: 'Hospital Discharge Point', coordinates: '25.3°N, 89.28°E', description: '[biohazard] Medical waste fragments sighted', status: 'INVESTIGATING', priority: 'CRITICAL', submittedByName: 'System Seed', anonymous: true, contactForUpdates: false }
  ];

  for (const r of reports) {
    await prisma.report.upsert({
      where: { reportCode: r.reportCode },
      update: {},
      create: r as Prisma.ReportCreateInput
    });
  }

  console.log(`Seed complete. Total reports ensured: ${reports.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
