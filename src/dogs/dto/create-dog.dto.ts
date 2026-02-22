export class CreateDogAccordionItemDto {
  title: string;
  text: string;
}

export class CreateDogDto {
  image_src: string;
  title: string;
  text: string;
  accordionData: CreateDogAccordionItemDto[];
}
