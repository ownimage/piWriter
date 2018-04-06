export class Track {
  constructor(
      public name: string,
      public path: string,
      public repeat: boolean,
      public autostartNext: boolean,
      public enabled: boolean,
  ) {}
}
