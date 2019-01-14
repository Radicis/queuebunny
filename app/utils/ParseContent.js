/**
 * Try to stringify the JSON or just return it
 * @param content
 * @returns {*}
 */
const parseContent = content => {
  try {
    const jsonString = JSON.stringify(JSON.parse(content), null, 2);
    return jsonString === '{}' ? '{\n\t\n}' : jsonString;
  } catch {
    return content;
  }
};

export default parseContent;
