export class ImageV2DTO {
  constructor(
      public parentDirName: string,
      public dirName: string,
      public name: string,
      public isFile : boolean
  ) {}
}
