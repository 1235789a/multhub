import { EvidencePage } from "../../components/EvidencePage";
import { getEvidencePage } from "../../data/evidencePages";
import { getGeoMetadata } from "../geoMetadata";

const page = getEvidencePage("stablecoin-geo");
export const metadata = getGeoMetadata(page);
export default function Page() { return <EvidencePage page={page} />; }
