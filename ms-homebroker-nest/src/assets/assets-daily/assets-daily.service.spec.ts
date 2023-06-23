import { Test, TestingModule } from '@nestjs/testing';
import { AssetsDailyService } from './assets-daily.service';

describe('AssetsDailyService', () => {
  let service: AssetsDailyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsDailyService],
    }).compile();

    service = module.get<AssetsDailyService>(AssetsDailyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
