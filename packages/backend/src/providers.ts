import type { ProviderExports } from "shared/defs";
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
import zlib from "./providers/zlib";
import appdoze from "./providers/appdoze";
import cmacked from "./providers/cmacked";
import mactorrents from "./providers/mactorrents";

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
  appdoze,
  cmacked,
  mactorrents,

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
