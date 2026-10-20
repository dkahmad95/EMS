/**
 * Browser-storage keys used for small per-user conveniences.
 * (`currentOfficeId` lives in PermissionsContext and is cleared on logout there.)
 * Everything listed here is wiped by `clearUserStorage()` on logout.
 */
export const LAST_REVENUE_OFFICE_KEY = "lastRevenueOfficeId"; // localStorage
export const DASHBOARD_FILTERS_KEY = "ems.dashboard.filters"; // sessionStorage
export const DASHBOARD_PERIOD_KEY = "ems.dashboard.period"; // sessionStorage

export const clearUserStorage = (): void => {
  try {
    localStorage.removeItem(LAST_REVENUE_OFFICE_KEY);
  } catch {
    /* storage unavailable */
  }
  try {
    sessionStorage.removeItem(DASHBOARD_FILTERS_KEY);
    sessionStorage.removeItem(DASHBOARD_PERIOD_KEY);
  } catch {
    /* storage unavailable */
  }
};
