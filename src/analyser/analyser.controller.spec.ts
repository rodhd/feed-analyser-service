import { Test, TestingModule } from '@nestjs/testing';
import { AnalyserController } from './analyser.controller';

describe('AnalyserController', () => {
  let controller: AnalyserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyserController],
    }).compile();

    controller = module.get<AnalyserController>(AnalyserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
