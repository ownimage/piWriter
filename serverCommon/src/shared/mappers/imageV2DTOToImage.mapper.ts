import {ImageV2DTO} from "../dto/imageV2DTO.model";
import {Image} from "../model/image.model";

const imageV2DTOToTrack = (image: ImageV2DTO) => {
    return new Image(
        image.parentDirName,
        image.dirName,
        image.name,
        image.isFile);
};

export {imageV2DTOToTrack};

