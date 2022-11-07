import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

const prisma = new PrismaClient({
    log: ["query"],
});

async function start() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
        origin: true,
    });

    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count();
        return { count };
    });

    fastify.post("/pools", async (request, response) => {
        const createPoolBody = z.object({
            title: z.string()
        });

        const generate = new ShortUniqueId({ length: 6 });
        const code = String(generate()).toUpperCase();

        try {
            const { title } = createPoolBody.parse(request.body);
            await prisma.pool.create({
                data: {
                    title,
                    code
                }
            });
        } catch (error) {
            return response.status(400).send(error);
        }

        return response.status(201).send({ code });
    });

    fastify.get("/users/count", async () => {
        const count = await prisma.user.count();
        return { count };
    });

    fastify.get("/guesses/count", async () => {
        const count = await prisma.guess.count();
        return { count };
    });

    await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ });
}

start();