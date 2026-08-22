import { createHmac } from 'node:crypto';

export type SuppressionScope = 'phone' | 'email' | 'domain' | 'company';

export function normalizeSuppressionValue(
  value: string,
  scope: SuppressionScope = 'phone',
): string {
  const trimmed = value.trim().toLowerCase();

  if (scope === 'phone') {
    return trimmed.replace(/\D/g, '');
  }

  if (scope === 'domain') {
    return trimmed
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
  }

  return trimmed;
}

export function createSuppressionHash(
  value: string,
  secret: string,
  scope: SuppressionScope = 'phone',
): string {
  if (secret.length < 8) {
    throw new Error('Suppression hash secret must be at least 8 characters.');
  }

  const normalizedValue = normalizeSuppressionValue(value, scope);
  if (!normalizedValue) {
    throw new Error('Suppression value cannot be empty.');
  }

  return createHmac('sha256', secret).update(`${scope}:${normalizedValue}`).digest('hex');
}
