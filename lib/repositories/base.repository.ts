import { prisma } from "../prisma";

export abstract class BaseRepository {
    protected static get db() {
        return prisma;
    }
}