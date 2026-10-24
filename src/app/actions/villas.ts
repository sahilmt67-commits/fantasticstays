"use server";

import {
  loadHomePage,
  loadListingPage,
  loadVillaPage,
} from "@/lib/villa-api";

export async function getHomeVillas() {
  return loadHomePage();
}

export async function getListingVillas() {
  return loadListingPage();
}

export async function getVillaDetail(slug: string) {
  return loadVillaPage(slug);
}
