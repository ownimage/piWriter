export class ConfigDTO {
  constructor(
      public NUM_LEDS: number,
      public speed: number,
      public brightness: number,
      public debounceTimeout : number
  ) {}
}
