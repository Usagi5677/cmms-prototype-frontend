export function isDeleted(deletedAt?: Date, status?: string) {
  let flag = false;
  if (deletedAt || status === "Dispose") {
    flag = true;
  }
  return flag;
}
