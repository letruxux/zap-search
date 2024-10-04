import Dodi from "./providers/dodi";
import Fitgirl from "./providers/fitgirl";
import Gog from "./providers/gog";
import Ovagames from "./providers/ovagames";
import Steamrip from "./providers/steamrip";
import Annasarchive from "./providers/annasarchive";
import Ofme from "./providers/ofme";
import Nxbrew from "./providers/nxbrew";
import Nswrom from "./providers/nswrom";
import Monkrus from "./providers/monkrus";
import Ziperto from "./providers/ziperto";
import kits4beats from "./providers/kits4beats";
import audioz from "./providers/audioz";
import plugintorrent from "./providers/plugintorrent";
import FourDownload from "./providers/4download";
import cracksurl from "./providers/cracksurl";

import type { ProviderExports } from "shared/defs";
import zlib from "./providers/zlib";

export default [
  /* games */
  Dodi,
  Fitgirl,
  Gog,
  Ovagames,
  Steamrip,
  Ofme,

  /* reading */
  Annasarchive,
  zlib,

  /* software */
  Monkrus,
  cracksurl,

  /* roms */
  Nxbrew,
  Nswrom,
  Ziperto,

  /* producing */
  kits4beats,
  audioz,
  plugintorrent,
  FourDownload,
] as ProviderExports[];
