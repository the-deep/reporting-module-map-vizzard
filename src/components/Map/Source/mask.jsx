import { Vector as VectorSource } from "ol/source";

function mask() {
  return new VectorSource({wrapX: false});
}

export default mask;
