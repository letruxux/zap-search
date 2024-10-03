import Dodi from "./providers/dodi";
import Fitgirl from "./providers/fitgirl";
import Gog from "./providers/gog";
import Ovagames from "./providers/ovagames";
import Steamrip from "./providers/steamrip";
import Annasarchive from "./providers/annasarchive";
import Filecr from "./providers/filecr";
import Ofme from "./providers/ofme";
import Nxbrew from "./providers/nxbrew";
import Nswrom from "./providers/nswrom";
import Monkrus from "./providers/monkrus";
import Ziperto from "./providers/ziperto";

import type { ProviderExports } from "shared/defs";

export default [
  Dodi,
  Fitgirl,
  Gog,
  Ovagames,
  Steamrip,
  Annasarchive,
  Filecr,
  Ofme,
  Nxbrew,
  Nswrom,
  Monkrus,
  Ziperto,
] as ProviderExports[];
