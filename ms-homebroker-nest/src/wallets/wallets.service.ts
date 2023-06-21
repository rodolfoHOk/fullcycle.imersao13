import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prismaService: PrismaService) {}

  listAll() {
    return this.prismaService.wallet.findMany();
  }

  create(input: { id: string }) {
    return this.prismaService.wallet.create({
      data: {
        id: input.id,
      },
    });
  }
}
