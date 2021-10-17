export function getVersionForToday(): string {
    const today = new Date();
    return `${today.getUTCFullYear()}.${today.getUTCMonth() + 1}.${today.getUTCDate()}`;
}
