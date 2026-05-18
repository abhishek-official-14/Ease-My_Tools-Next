import { FaCalculator, FaExchangeAlt, FaFile, FaGlobe, FaHeartbeat, FaImage, FaQrcode } from "react-icons/fa";
import { BiText } from "react-icons/bi";
import type { ToolCategoryConfig } from "@/types/tool";

export const categoryTitles: Record<ToolCategoryConfig["id"], string> = {
  image: "Image Tools",
  converters: "Converters",
  text: "Text Tools",
  calculators: "Calculators",
  file: "File Tools",
  web: "Web Tools",
  generators: "Generators",
  health: "Health Tools",
};

export const toolCategoryConfig: ToolCategoryConfig[] = [
  { id: "image", title: "Image Tools", description: "Resize, convert and edit images", color: "#F97316", icon: FaImage, link: "/tools/image" },
  { id: "converters", title: "Converters", description: "Various format converters", color: "#8B5CF6", icon: FaExchangeAlt, link: "/tools/converters" },
  { id: "text", title: "Text Tools", description: "Text formatting and analysis", color: "#06B6D4", icon: BiText, link: "/tools/text" },
  { id: "calculators", title: "Calculators", description: "Various calculation tools", color: "#10B981", icon: FaCalculator, link: "/tools/calculators" },
  { id: "file", title: "File Tools", description: "File conversion and management", color: "#0D9488", icon: FaFile, link: "/tools/file" },
  { id: "web", title: "Web Tools", description: "Web development utilities", color: "#EC4899", icon: FaGlobe, link: "/tools/web" },
  { id: "generators", title: "Generators", description: "Code and content generators", color: "#F59E0B", icon: FaQrcode, link: "/tools/generators" },
  { id: "health", title: "Health Tools", description: "Health and fitness utilities", color: "#F43F5E", icon: FaHeartbeat, link: "/tools/health" },
];
