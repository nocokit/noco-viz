/**
 * License Configuration
 * Noco-Viz Dual License Strategy
 */

export enum LicenseType {
  COMMUNITY = 'community',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export interface LicenseConfig {
  type: LicenseType;
  maxProjects: number;
  features: {
    unlimitedProjects: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    advancedFeatures: boolean;
  };
}

export const LICENSE_CONFIGS: Record<LicenseType, LicenseConfig> = {
  [LicenseType.COMMUNITY]: {
    type: LicenseType.COMMUNITY,
    maxProjects: 15,
    features: {
      unlimitedProjects: false,
      prioritySupport: false,
      customBranding: false,
      advancedFeatures: false,
    },
  },
  [LicenseType.PROFESSIONAL]: {
    type: LicenseType.PROFESSIONAL,
    maxProjects: -1, // unlimited
    features: {
      unlimitedProjects: true,
      prioritySupport: true,
      customBranding: false,
      advancedFeatures: false,
    },
  },
  [LicenseType.ENTERPRISE]: {
    type: LicenseType.ENTERPRISE,
    maxProjects: -1, // unlimited
    features: {
      unlimitedProjects: true,
      prioritySupport: true,
      customBranding: true,
      advancedFeatures: true,
    },
  },
};

/**
 * Get current license type from environment
 * Default: COMMUNITY (AGPL-3.0, 15 projects limit)
 */
export function getCurrentLicense(): LicenseConfig {
  const licenseType = (process.env.LICENSE_TYPE || LicenseType.COMMUNITY) as LicenseType;
  return LICENSE_CONFIGS[licenseType] || LICENSE_CONFIGS[LicenseType.COMMUNITY];
}

/**
 * Check if project limit is reached
 */
export function isProjectLimitReached(currentCount: number): boolean {
  const license = getCurrentLicense();
  if (license.maxProjects === -1) {
    return false; // unlimited
  }
  return currentCount >= license.maxProjects;
}
