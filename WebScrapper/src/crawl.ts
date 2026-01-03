import { JSDOM } from 'jsdom'

export function normalizeURL(url: string) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

export function getH1FromHTML(html: string): string {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const h1 = document.querySelector('h1')

  if (!h1) {
    return ''
  }

  const answer =h1.textContent?.trim() ?? ''
  console.log(answer);
  return answer;
  
}

const html2=`<html>
<body>

    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>

</body>
</html>
`;

getH1FromHTML(html2);

export function getFirstParagraphFromHTML(html: string): string {
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Prefer <main> if it exists
  const main = document.querySelector('main')
  const paragraph =
    main?.querySelector('p') ?? document.querySelector('p')

  if (!paragraph) {
    return ''
  }

  return paragraph.textContent?.trim() ?? ''
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const urls: string[] = []
  const dom = new JSDOM(html)
  const document = dom.window.document

  const anchors = document.querySelectorAll('a')

  for (const anchor of anchors) {
    const href = anchor.getAttribute('href')
    if (!href) continue

    try {
      const url = new URL(href, baseURL)
      urls.push(url.href)
    } catch {
      // ignore invalid URLs
    }
  }

  return urls
}


export function getImagesFromHTML(html: string, baseURL: string): string[] {
  const images: string[] = []
  const dom = new JSDOM(html)
  const document = dom.window.document

  const imgTags = document.querySelectorAll('img')

  for (const img of imgTags) {
    const src = img.getAttribute('src')
    if (!src) continue

    try {
      const url = new URL(src, baseURL)
      images.push(url.href)
    } catch {
      // ignore invalid URLs
    }
  }

  return images
}