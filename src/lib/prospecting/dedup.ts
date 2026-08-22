/**
 * Deduplication & Company Identity Match Hierarchy Engine
 * 
 * Matches candidate business import records against existing prospects using a strict 5-tier confidence hierarchy:
 * 1. Provider Place ID
 * 2. Normalized Domain
 * 3. Normalized Phone Number (digits only)
 * 4. Normalized Business Name + Postal Code
 * 5. Normalized Business Name + Street Address
 */

export interface ProspectCandidate {
  id?: string;
  name: string;
  websiteUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  zip?: string | null;
  placeId?: string | null;
}

export type MatchConfidence = 'exact_place_id' | 'exact_domain' | 'exact_phone' | 'probable_name_zip' | 'probable_name_address' | 'none';

export interface MatchResult {
  isMatch: boolean;
  matchType: MatchConfidence;
  existingProspectId?: string;
  matchedField?: string;
}

export function normalizeDomain(url?: string | null): string {
  if (!url) return '';
  let clean = url.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//, '').replace(/^www\./, '');
  clean = clean.split('/')[0].split('?')[0]; // Hostname only
  return clean;
}

export function normalizePhone(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/\D/g, ''); // Digits only
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findDuplicateProspect(
  candidate: ProspectCandidate,
  existingList: ProspectCandidate[]
): MatchResult {
  const candidatePlaceId = candidate.placeId?.trim();
  const candidateDomain = normalizeDomain(candidate.websiteUrl);
  const candidatePhone = normalizePhone(candidate.phone);
  const candidateName = normalizeName(candidate.name);
  const candidateZip = candidate.zip?.trim();
  const candidateAddress = candidate.address ? normalizeName(candidate.address) : '';

  for (const existing of existingList) {
    // Tier 1: Place ID
    if (candidatePlaceId && existing.placeId && candidatePlaceId === existing.placeId.trim()) {
      return { isMatch: true, matchType: 'exact_place_id', existingProspectId: existing.id, matchedField: 'placeId' };
    }

    // Tier 2: Normalized Domain
    const existingDomain = normalizeDomain(existing.websiteUrl);
    if (candidateDomain && existingDomain && candidateDomain === existingDomain) {
      return { isMatch: true, matchType: 'exact_domain', existingProspectId: existing.id, matchedField: 'websiteUrl' };
    }

    // Tier 3: Normalized Phone (Min 7 digits)
    const existingPhone = normalizePhone(existing.phone);
    if (candidatePhone && existingPhone && candidatePhone.length >= 7 && candidatePhone === existingPhone) {
      return { isMatch: true, matchType: 'exact_phone', existingProspectId: existing.id, matchedField: 'phone' };
    }

    // Tier 4: Name + Zip Code
    const existingName = normalizeName(existing.name);
    const existingZip = existing.zip?.trim();
    if (candidateName && candidateZip && existingName && existingZip && candidateName === existingName && candidateZip === existingZip) {
      return { isMatch: true, matchType: 'probable_name_zip', existingProspectId: existing.id, matchedField: 'name_zip' };
    }

    // Tier 5: Name + Street Address
    const existingAddress = existing.address ? normalizeName(existing.address) : '';
    if (candidateName && candidateAddress && existingName && existingAddress && candidateName === existingName && candidateAddress === existingAddress) {
      return { isMatch: true, matchType: 'probable_name_address', existingProspectId: existing.id, matchedField: 'name_address' };
    }
  }

  return { isMatch: false, matchType: 'none' };
}
