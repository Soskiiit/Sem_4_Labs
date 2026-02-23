import { CreateDogAccordionItemDto } from './create-dog.dto';

export class UpdateDogDto {
  image_src?: string;
  title?: string;
  text?: string;
  accordionData?: CreateDogAccordionItemDto[];
}
