import { unsplash } from "@/lib/images";

/**
 * Curated Unsplash placeholders. Real client project photos are uploaded from the admin panel
 * and replace these through the database, so nothing here needs editing for launch.
 */
export const PHOTO = {
  illuminatedLettering: "1501339847302-ac426a4a7cbb",
  storefrontWindow: "1528698827591-e19ccd7bc23d",
  streetStorefront: "1559925393-8be0ec4767c8",
  designTablet: "1572044162444-ad60f128bdea",
  designDesk: "1626785774625-ddcddc3445e9",
  colourSwatches: "1561070791-2526d30994b5",
  wrappedBus: "1570125909232-eb263c188f7e",
  fleetTruck: "1592838064575-70ed626d3a0e",
  fleetYard: "1565793298595-6a879b1d9492",
  officeGlass: "1497366754035-f200968a6e72",
  officeCorridor: "1497366216548-37526070297c",
  conferenceHall: "1511578314322-379afb476865",
  eventAudience: "1540575467063-178a50c2df87",
  installer: "1621905251189-08b45d6a269e",
  fabrication: "1504328345606-18bbc8c9d7d1",
  blueprint: "1503387762-592deb58ef4e",
  retailArcade: "1481437156560-3205f6a55735",
  cafeWallBoard: "1493857671505-72967e2e2760",
  menuBoards: "1514933651103-005eec06c04b",
  constructionSite: "1541888946425-d81bb19240f5",
  realEstate: "1560518883-ce09059eeffa",
  cityNight: "1486325212027-8081e485255e",
  neonStreet: "1519608487953-e999c86e7455",
} as const;

export const img = (key: keyof typeof PHOTO, width = 1600) => unsplash(PHOTO[key], width);
