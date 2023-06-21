import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  listAll() {
    return this.assetsService.listAll();
  }

  @Post()
  create(@Body() body: { id: string; symbol: string; price: number }) {
    return this.assetsService.create(body);
  }
}
