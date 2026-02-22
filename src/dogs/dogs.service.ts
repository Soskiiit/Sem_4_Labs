import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Dog } from './entities/dog.entity';
import { FileService } from '../file.service';

@Injectable()
export class DogsService {
  constructor(private fileService: FileService<Dog[]>) {}

  create(createDogDto: CreateDogDto) {
    const dogs = this.fileService.read();
    const id = dogs.length > 0 ? Math.max(...dogs.map(d => d.id)) + 1 : 1;
    
    const dog: Dog = { 
        id,
        ...createDogDto
    };

    this.fileService.add(dog);
    return dog;
  }

  findAll(title?: string) {
    const dogs = this.fileService.read();
    
    return title
      ? dogs.filter(dog => dog.title.toLowerCase().includes(title.toLowerCase()))
      : dogs;
  }

  findOne(id: number) {
    const dogs = this.fileService.read();
    return dogs.find((dog) => dog.id === id);
  }

  update(id: number, updateDogDto: UpdateDogDto) {
    const dogs = this.fileService.read();

    const updatedDogs = dogs.map((dog) =>
      dog.id === id ? { ...dog, ...updateDogDto } : dog,
    );

    this.fileService.write(updatedDogs);
    return this.findOne(id);
  }

  remove(id: number) {
    const dogs = this.fileService.read();
    const dogToDelete = dogs.find((dog) => dog.id === id);
    const filteredDogs = dogs.filter((dog) => dog.id !== id);

    this.fileService.write(filteredDogs);
    if (dogToDelete)
      return { deleted: true, dog_title: dogToDelete.title };
    return { deleted: false , error: 'Dog not found'};
  }
}
