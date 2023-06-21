import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService) {}

  listAll() {
    return this.prismaService.asset.findMany();
  }

  create(input: { id: string; symbol: string; price: number }) {
    return this.prismaService.asset.create({
      data: input,
    });
  }
}
