export const updateObject = (old_object: Record<string, any>, new_object: Record<string, any>) => {
  for (const key in new_object) old_object[key] = new_object[key];
};

export const openLink = (href: string, target = '_self') => {
  const a = document.createElement('a');
  a.href = href;
  a.target = target;
  a.click();
};

export const copyLink = async (copy: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(copy);
    else copyLinkEldes(copy);
  } catch (_) {
    copyLinkEldes(copy);
  }
};

const copyLinkEldes = (copy: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = copy;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand('copy');
  textArea.remove();
};

export const downloadAnyFile = (file: Blob, name: string) => {
  const urlCreator = window.URL || window.webkitURL;
  const href = urlCreator.createObjectURL(file);

  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.click();
};
