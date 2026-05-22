import type { Metadata } from "next";
import TariffLensClient from "./TariffLensClient";

export const metadata: Metadata = {
  title: "Tariff Lens · 关税透镜",
  description:
    "把模糊的商品描述，30 秒透出 HS Code、起征点判断与综合税费。蜕羽自研工具。",
};

export default function TariffLensPage() {
  return <TariffLensClient />;
}
