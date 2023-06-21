import { PrismaClient } from "@prisma/client";

const globalPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV !== "production") {
    if (globalPrisma.prisma === undefined) {
        globalPrisma.prisma = new PrismaClient();
    }
}

let prisma: PrismaClient = globalPrisma.prisma || new PrismaClient();

export default prisma;