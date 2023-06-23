import { Test, TestingModule } from '@nestjs/testing';
import { AssetsDailyController } from './assets-daily.controller';

describe('AssetsDailyController', () => {
  let controller: AssetsDailyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsDailyController],
    }).compile();

    controller = module.get<AssetsDailyController>(AssetsDailyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
