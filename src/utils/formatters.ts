export function maskName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return trimmed[0] + '*';
  return trimmed[0] + '*'.repeat(trimmed.length - 2) + trimmed[trimmed.length - 1];
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function getNextDivisionCode(existingCodes: Record<string, string>): string {
  const used = Object.values(existingCodes);
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    if (!used.includes(letter)) return letter;
  }
  return 'X' + Date.now().toString().slice(-3);
}

/**
 * 부수를 낮은 숫자순(오름차순)으로 정렬 (예: 1부 -> 2부 -> 3부 -> 4부 -> 6부)
 */
export function sortDivisions(divisions: string[]): string[] {
  return [...divisions].sort((a, b) => {
    const matchA = a.match(/\d+/);
    const matchB = b.match(/\d+/);

    if (matchA && matchB) {
      const numA = parseInt(matchA[0], 10);
      const numB = parseInt(matchB[0], 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } else if (matchA) {
      return -1;
    } else if (matchB) {
      return 1;
    }
    return a.localeCompare(b, 'ko');
  });
}
