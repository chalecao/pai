export function handleComa(data) {
  return data.replace(/(&#8220;)/g, '"').replace(/(&#8221;)/g, '"').replace(/(&#8243;)/g, '"').replace("<p>","").replace("</p>","");
}