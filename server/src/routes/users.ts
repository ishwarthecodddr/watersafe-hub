import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const usersRouter = Router();

const createUserSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email()
});

usersRouter.get('/', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users);
});

usersRouter.post('/', async (req: Request, res: Response) => {
  const parse = createUserSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const user = await prisma.user.upsert({
    where: { email: parse.data.email },
    update: { name: parse.data.name ?? undefined },
    create: { email: parse.data.email, name: parse.data.name ?? null }
  });
  res.status(201).json(user);
});
