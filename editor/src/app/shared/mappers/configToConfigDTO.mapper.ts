import { ConfigDTO } from '../dto/configDTO.model';
import { Config} from '../model/config.model';

const configToConfigDTO = (config: Config) => {
    return new ConfigDTO(
        config.NUM_LEDS,
        config.speed,
        config.brightness,
        config.debounceTimeout,
        config.smallPreviewHeight,
        config.largePreviewHeight
    );
};

export {configToConfigDTO};
