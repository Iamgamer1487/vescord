'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMessages() {
    const messages = await prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc', // Replace 'createdAt' with your actual timestamp field or use 'id' for reverse order
      },
    });
    return messages;
  }

export async function createMessage(message: string, userName: string, userId: string) {
    try {
        const newMessage = await prisma.chat.create({
            data: {
                message,
                userName,
                userId,
            },
        });

        console.log('Message created:', newMessage);
        return newMessage; // Return the newly created message
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}

