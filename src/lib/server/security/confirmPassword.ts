export function passwordConfirmValid(lastConfirmedAt: Date) {
    const expiryTime = new Date(Date.now() - 1000 * 60 * 30); // 30 minitutes

    const timeLapsed = lastConfirmedAt.getTime() - expiryTime.getTime();

    return timeLapsed > 0;
}
