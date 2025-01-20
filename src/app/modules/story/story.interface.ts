type TSlide = {
  image: string;
  description: string;
}

export type TStory = {
  image: string;
  title: string;
  slides: TSlide[];
}