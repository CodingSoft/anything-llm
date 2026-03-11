const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await prisma.users.create({
      data: {
        email: 'admin@anythingllm.com',
        username: 'admin',
        role: 'admin',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('Usuario admin creado exitosamente');
    console.log('Email: admin@anythingllm.com');
    console.log('Contraseña: password');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
