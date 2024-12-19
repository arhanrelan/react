export const hasFollowedNews = () => {
  if (
    localStorage.getItem("followed-articles") === null ||
    JSON.parse(localStorage.getItem("followed-articles")).length === 0
  ) {
    return false;
  }

  return true;
};
