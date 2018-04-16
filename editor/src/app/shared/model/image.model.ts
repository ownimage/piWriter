export class Image {
    constructor(
        private _parentDirName: string,
        private _dirName: string,
        private _name: string,
        private _isFile : boolean
    ) {}

    get parentDirName(): string {
        return this._parentDirName;
    }

    get dirName(): string {
        return this._dirName;
    }

    get name(): string {
        return this._name;
    }

    get isFile(): boolean {
        return this._isFile;
    }

}
