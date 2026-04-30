import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import prismaClient from '../../prisma';

class UserService {
  async criar({ nome, email, senha }: { nome: string; email: string; senha: string }) {
    const nomeLimpo = nome?.trim();
    const emailLimpo = email?.trim().toLowerCase();

    if (!nomeLimpo) throw new Error('Nome obrigatório');
    if (!emailLimpo) throw new Error('Email obrigatório');
    if (!senha || senha.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');

    const existe = await prismaClient.usuario.findUnique({ where: { email: emailLimpo } });
    if (existe) throw new Error('Email já cadastrado');

    const usuario = await prismaClient.usuario.create({
      data: {
        nome: nomeLimpo,
        email: emailLimpo,
        senha: await hash(senha, 8)
      },
      select: { id: true, nome: true, email: true }
    });

    return usuario;
  }

  async autenticar({ email, senha }: { email: string; senha: string }) {
    const emailLimpo = email?.trim().toLowerCase();
    if (!emailLimpo || !senha) throw new Error('Email e senha obrigatórios');

    const usuario = await prismaClient.usuario.findUnique({ where: { email: emailLimpo } });
    if (!usuario) throw new Error('Email ou senha inválidos');

    const senhaValida = await compare(senha, usuario.senha);
    if (!senhaValida) throw new Error('Email ou senha inválidos');

    const token = sign(
      { nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET || 'arena084-financeiro',
      { subject: String(usuario.id), expiresIn: '7d' }
    );

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token
    };
  }

  async detalhe(id: number) {
    if (!id) throw new Error('Usuário inválido');

    return prismaClient.usuario.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true }
    });
  }
}

export { UserService };
