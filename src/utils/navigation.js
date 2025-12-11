export const getTableNumber = () => {
  const params = new URLSearchParams(window.location.search);
  const tableFromUrl = params.get("table");
  
  if (tableFromUrl) {
    const tableStr = String(tableFromUrl);
    localStorage.setItem("tableNumber", tableStr);
    return tableStr;
  }
  
  return localStorage.getItem("tableNumber") || "1";
};

export const navigateWithTable = (navigate, path) => {
  const table = getTableNumber();
  navigate(`${path}?table=${table}`);
};