export const commonSelectionStart = (input: HTMLElement) => {
  input.focus();

  const range = document.createRange();
  range.selectNodeContents(input);
  range.collapse(false);

  const sel = window.getSelection();
  if (!sel) return;

  sel.removeAllRanges();
  sel.addRange(range);
};

export class ManipulationContenteditable {
  #document;
  #string;
  constructor(string: string) {
    this.#document = document.implementation.createHTMLDocument('');
    this.#string = string;
  }
  #manipulation() {
    const rules = this.getRules;
    this.#string = this.#string
      .replace(rules.CODE_REGEX, '<code>$1</code>')
      .replace(rules.STRONG_REGEX, '<strong>$1</strong>')
      .replace(rules.CURSIVE_REGEX, '<em>$1</em>')
      .replace(rules.ATTACHMENT_REGEX, '<a target="_blank" rel="noopener" href="$2">$1</a>')
      .replace(rules.LINK_REGEX, '<a target="_blank" rel="noopener" href="$1">$1</a>');
    return this.getSafeHTML;
  }
  #rules() {
    const STRONG_REGEX = /\*\*([^**]+)\*\*/g;
    const CODE_REGEX = /`([^**]+)*`/g;
    const ATTACHMENT_REGEX = /\[([^[()\]]+)\]\(([^[()\]]+)\)/g;
    const CURSIVE_REGEX = /\*([^**]+)\*/g;
    const LINK_REGEX = /(https?:\/\/[^\s"]+)/g;
    return { STRONG_REGEX, CODE_REGEX, ATTACHMENT_REGEX, CURSIVE_REGEX, LINK_REGEX };
  }
  #safeHTML() {
    const div = this.getDocument.createElement('div');
    div.innerHTML = this.#string;

    for (let elements = div.querySelectorAll('*'), i = elements.length - 1; i >= 0; i--) {
      const element = elements[i] as Element,
        tagName = element.localName;

      if (
        tagName == 'script' ||
        tagName == 'noscript' ||
        tagName == 'noembed' ||
        !(element.attributes instanceof NamedNodeMap)
      ) {
        try {
          element.parentNode?.removeChild(element);
        } catch (e) {
          element.outerHTML = '';
        }
        continue;
      }

      if (!element.hasAttributes()) continue;

      for (let attributes = element.attributes, j = attributes.length - 1; j >= 0; j--) {
        const attribute = attributes[j] as Attr,
          attributeName = attribute.localName,
          attributeValue = attribute.value
            .replace(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g, '')
            .toLowerCase()
            .trim();

        if (attributeName.indexOf('on') == 0) element.removeAttribute(attributeName);
        else if (
          (attributeName == 'src' || attributeName == 'href') &&
          attributeValue.indexOf('javascript:') == 0
        )
          element.removeAttribute(attributeName);
        else if (
          ['audio', 'image', 'img', 'source', 'video'].indexOf(tagName) == -1 &&
          (attributeName == 'src' || attributeName == 'data') &&
          attributeValue.indexOf('data:') == 0
        )
          element.removeAttribute(attributeName);
      }
    }

    return div.innerHTML;
  }
  get getDocument() {
    return this.#document;
  }
  get getManipulation() {
    return this.#manipulation();
  }
  get getRules() {
    return this.#rules();
  }
  get getSafeHTML() {
    return this.#safeHTML();
  }
  set setString(str: string) {
    this.#string = str;
  }
}

export const manipulation = new ManipulationContenteditable('');
