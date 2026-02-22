import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { DogsController } from './dogs.controller';
import { FileService } from '../file.service';

@Module({
  controllers: [DogsController],
  providers: [
    DogsService,
    {
      provide: FileService,
      useFactory: () => {
        return new FileService('assets/dogs.json');
      },
    },
  ],
})
export class DogsModule {}
