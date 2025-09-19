import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const reportsRouter = Router();

const createReportSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  location: z.string().min(1),
  coordinates: z.string().optional().nullable(),
  issueType: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(1),
  anonymous: z.boolean().optional().default(false),
  contactForUpdates: z.boolean().optional().default(true),
});

// List all reports (newest first)
reportsRouter.get("/", async (req: Request, res: Response) => {
  const reports = await prisma.report.findMany({
    orderBy: { submittedAt: "desc" },
  });
  res.json(reports);
});

reportsRouter.get("/:id", async (req: Request, res: Response) => {
  const report = await prisma.report.findUnique({
    where: { id: req.params.id },
  });
  if (!report) return res.status(404).json({ error: "Not found" });
  res.json(report);
});

// Create a report from CitizenReport page form
reportsRouter.post("/", async (req: Request, res: Response) => {
  const parse = createReportSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data;
  const normalizeCoords = (raw?: string | null): string | null => {
    if (!raw) return null;
    const cleaned = raw.replace(/°/g, '').trim();
    const parts = cleaned.split(',').map(p => p.trim());
    if (parts.length !== 2) return raw; // keep original if unexpected format
    const parsePart = (p: string): number | null => {
      const m = p.match(/^(-?\d+(?:\.\d+)?)([NnSsEeWw])?$/);
      if (!m) return null;
      let v = parseFloat(m[1]);
      const d = m[2]?.toUpperCase();
      if (d === 'S' || d === 'W') v = -v;
      return isNaN(v) ? null : v;
    };
    const lat = parsePart(parts[0]);
    const lng = parsePart(parts[1]);
    if (lat == null || lng == null) return raw;
    return `${lat},${lng}`;
  };
  const code = `WS-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
  const priorityMap: Record<string, "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
    critical: "CRITICAL",
  };
  const report = await prisma.report.create({
    data: {
      reportCode: code,
      location: data.location,
  coordinates: normalizeCoords(data.coordinates) ?? null,
      description: `[${data.issueType}] ${data.description}`,
      status: "PENDING",
      priority: priorityMap[data.priority],
      submittedByName: data.anonymous ? null : data.name ?? null,
      submittedByEmail: data.anonymous ? null : data.email ?? null,
      anonymous: data.anonymous ?? false,
      contactForUpdates: data.contactForUpdates ?? true,
    },
  });
  res.status(201).json(report);
});

// Minimal moderation/update endpoint
const updateSchema = z.object({
  status: z.enum(["PENDING", "INVESTIGATING", "RESOLVED"]).optional(),
  officialResponse: z.string().optional().nullable(),
  actionTaken: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

reportsRouter.patch("/:id", async (req: Request, res: Response) => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  try {
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        ...parse.data,
        resolvedAt: parse.data.status === "RESOLVED" ? new Date() : undefined,
      },
    });
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

reportsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});
