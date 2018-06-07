import { ConfigDTO } from '../dto/configDTO.model';
import { Config} from '../model/config.model';

const configDTOToConfig = (config: ConfigDTO) => {
    return new Config(
        config.NUM_LEDS,
        config.speed,
        config.brightness,
        config.debounceTimeout,
        config.smallPreviewHeight,
        config.largePreviewHeight
    );
};

export {configDTOToConfig};
