import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/edutrindade.png'
        },
    });

    const pool = await prisma.pool.create({
        data: {
            title: 'Pool 1',
            code: 'BOL123',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id,
                }
            }
        },
    });

    await prisma.game.create({
        data: {
            date: '2022-11-24T16:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'SE',
        }
    });

    await prisma.game.create({
        data: {
            date: '2022-11-28T13:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'SU',
        }
    });

    await prisma.game.create({
        data: {
            date: '2022-12-02T16:00:00.201Z',
            firstTeamCountryCode: 'CA',
            secondTeamCountryCode: 'BR',

            guesses: {
                create: {
                    firstTeamScore: 2,
                    secondTeamScore: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    });

}

main();