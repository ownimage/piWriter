export class Config {
  constructor(
      public NUM_LEDS: number,
      public speed: number,
      public brightness: number,
      public debounceTimeout : number,
      public smallPreviewHeight : number = 50,
      public largePreviewHeight : number = 72
  ) {}
}
