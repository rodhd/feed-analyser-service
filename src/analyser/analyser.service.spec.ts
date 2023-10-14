import { Test, TestingModule } from '@nestjs/testing';
import { AnalyserService } from './analyser.service';

describe('AnalyserService', () => {
  let service: AnalyserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyserService],
    }).compile();

    service = module.get<AnalyserService>(AnalyserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
