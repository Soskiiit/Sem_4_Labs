import { CreateDogAccordionItemDto } from './create-dog.dto';

export class UpdateDogDto {
  src?: string;
  title?: string;
  text?: string;
  accordionData?: CreateDogAccordionItemDto[];
}
