import setupI18n from './setupI18n';

export default function isBooted() {
  const BOOT_REQUIREMENTS = [setupI18n];
  const state = BOOT_REQUIREMENTS.map((initializer) => initializer());
  const booted = state.reduce((acc, val) => acc && val, true);
  return booted;
}
