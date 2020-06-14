export default function xmlParser(text) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');

  const rootElement = xmlDoc.documentElement;
  const children = rootElement.childNodes;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === 'item') {
      const title = child.getElementsByTagName('title')[0];
      const description = child.getElementsByTagName('description')[0];

      if (title.textContent === 'USD') {
        return parseFloat(description.textContent);
      }
    }
  }

  return null;
}
