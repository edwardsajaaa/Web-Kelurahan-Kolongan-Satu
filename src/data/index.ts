import { DATA_MONOGRAFI_2024 } from './monografi2024';
import { DATA_MONOGRAFI_2025 } from './monografi2025';

export const MONOGRAFI_ARCHIVE = {
  2024: DATA_MONOGRAFI_2024,
  2025: DATA_MONOGRAFI_2025
};

export type AvailableYear = 2024 | 2025;
export const CURRENT_ACTIVE_YEAR: AvailableYear = 2025;

export { DATA_MONOGRAFI_2024 } from './monografi2024';
export { DATA_MONOGRAFI_2025 } from './monografi2025';
export { DATA_SEJARAH_KOLONGAN_SATU } from './sejarahKolonganSatu';
export type { WarisanSejarah, TokohSejarah } from './sejarahKolonganSatu';
