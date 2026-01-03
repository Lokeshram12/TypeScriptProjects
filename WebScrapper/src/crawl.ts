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

type ExtractedPageData = {
  url: string;
  h1: string;
  first_paragraph?: string; // Optional field
  outgoing_links: string[];
  image_urls: string[];
};

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
  const h1 = getH1FromHTML(html); // Get the H1 content
  const firstParagraph = getFirstParagraphFromHTML(html); // Get the first paragraph
  const outgoingLinks = getURLsFromHTML(html, pageURL); // Get the links from the HTML
  const imageUrls = getImagesFromHTML(html, pageURL); // Get the image URLs from the HTML

  // Return the extracted data in the expected format
  return {
    url: pageURL,
    h1,
    first_paragraph: firstParagraph || '', // Ensure first_paragraph is never undefined
    outgoing_links: outgoingLinks,
    image_urls: imageUrls,
  };
}


export async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error("Error: no base URL provided")
    process.exit(1)
  }

  if (args.length > 1) {
    console.error("Error: too many arguments provided")
    process.exit(1)
  }

  const baseURL = args[0]
  console.log(`Starting crawl at ${baseURL}`)
//  await getHTML(baseURL);
const pages = await crawlPage(baseURL)
  console.log("Crawl complete!")
  console.log(pages)
  // process.exit(0)
}

main()

export async function getHTML(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BootCrawler/1.0",
      },
    })

    // Check HTTP status code
    if (response.status >= 400) {
      console.error(
        `Error: HTTP ${response.status} fetching ${url}`
      )
      return
    }

    // Check content-type
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("text/html")) {
      console.error(
        `Error: content-type is not text/html (${contentType})`
      )
      return
    }

    const html = await response.text()
    console.log(html)

    return html
  } catch (err) {
    console.error(`Error fetching ${url}:`, err)
  }
}


export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {}
): Promise<Record<string, number>> {
  // 1️⃣ Make sure we are on the same domain
  const baseHost = new URL(baseURL).host;
  const currentHost = new URL(currentURL).host;
  if (baseHost !== currentHost) {
    return pages;
  }

  // 2️⃣ Normalize the URL
  const normalizedURL = normalizeURL(currentURL);

  // 3️⃣ If we've already crawled this page, increment count and stop recursion
  if (pages[normalizedURL]) {
    pages[normalizedURL]++;
    return pages;
  }

  // 4️⃣ Mark this page as crawled
  pages[normalizedURL] = 1;

  console.log(`Crawling: ${currentURL}`);

  // 5️⃣ Fetch the HTML
  const html = await getHTML(currentURL);
  if (!html) {
    return pages; // Stop if fetch failed
  }

  // 6️⃣ Extract all URLs from the page
  const nextURLs = getURLsFromHTML(html, baseURL);

  // 7️⃣ Recursively crawl all URLs
  for (const url of nextURLs) {
    pages = await crawlPage(baseURL, url, pages);
  }

  // 8️⃣ Return updated pages object
  return pages;
}
