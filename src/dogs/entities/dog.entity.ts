export class DogAccordionItem {
  title: string;
  text: string;
}

export class Dog {
  id: number;
  image_src: string;
  title: string;
  text: string;
  accordionData: DogAccordionItem[];
}
