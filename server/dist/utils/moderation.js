const bannedKeywords = [
    "kill",
    "murder",
    "bomb",
    "rape",
    "terrorist",
    "fraud",
    "scam"
];
export function containsIllegalContent(text) {
    const lower = text.toLowerCase();
    return bannedKeywords.some(word => lower.includes(word));
}
