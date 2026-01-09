import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import * as crypto from 'crypto';
import { SignUpSchema, LoginSchema } from '@marketing-autopilot/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async signup(data: any) {
    const parsed = SignUpSchema.parse(data);
    
    const existing = await this.prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: parsed.email,
        password: this.hashPassword(parsed.password),
        name: parsed.name,
      },
    });

    await this.auditService.log(user.id, 'USER_SIGNUP');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(data: any) {
    const parsed = LoginSchema.parse(data);

    const user = await this.prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user || user.password !== this.hashPassword(parsed.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.auditService.log(user.id, 'USER_LOGIN');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      organizations: user.memberships.map(m => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
      })),
    };
  }
}
