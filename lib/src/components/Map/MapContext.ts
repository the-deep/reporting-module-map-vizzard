import { Map } from 'ol';
import { createContext } from 'react';

export interface MapContextProps {
    map: Map | null;
    setMap: React.Dispatch<React.SetStateAction<Map | null>>;
}

const MapContext = createContext<MapContextProps>({
    map: null,
    setMap: () => {
        // eslint-disable-next-line no-console
        console.error('MapContext::setMap called without a provider');
    },
});

export default MapContext;
