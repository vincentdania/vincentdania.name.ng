import type { NavigationItem } from "@/lib/types";

const phdResearchItem: NavigationItem = {
  label: "PhD Research",
  href: "/phd",
  order: 5,
  visible: true,
  open_in_new_tab: false,
};

const consultItem: NavigationItem = {
  label: "AI Consultation",
  href: "/consult",
  order: 6,
  visible: true,
  open_in_new_tab: false,
};

export function getPrimaryNavigationItems(items: NavigationItem[]) {
  const navigationItems = [...items];

  if (!navigationItems.some((item) => item.href === phdResearchItem.href)) {
    navigationItems.push(phdResearchItem);
  }

  if (!navigationItems.some((item) => item.href === consultItem.href)) {
    navigationItems.push(consultItem);
  }

  return navigationItems.sort((left, right) => left.order - right.order);
}

function normalizePath(value: string) {
  return value.replace(/\/$/, "") || "/";
}

export function isNavigationItemActive(
  pathname: string,
  href: string,
) {
  if (!href || href.startsWith("http")) {
    return false;
  }

  const [hrefPath, hrefHash] = href.split("#");
  const normalizedHref = normalizePath(hrefPath || "/");
  const normalizedPath = normalizePath(pathname);

  if (hrefHash) {
    return normalizedHref !== "/" && normalizedPath === normalizedHref;
  }

  if (normalizedHref === "/") {
    return normalizedPath === "/";
  }

  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
}
