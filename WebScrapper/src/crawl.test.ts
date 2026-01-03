import { it,test, expect,describe,beforeEach,vi } from "vitest";
import { normalizeURL,getH1FromHTML ,getFirstParagraphFromHTML,getURLsFromHTML
    ,getImagesFromHTML,extractPageData,getHTML,crawlPage
} from "./crawl";

test("normalizeURL protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL http", () => {
  const input = "http://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

describe('getH1FromHTML', () => {
  it('returns the text content of the h1 tag', () => {
    const html = `
      <html>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>
    `

    expect(getH1FromHTML(html)).toBe('Hello World')
  })

  it('returns the first h1 if multiple h1 tags exist', () => {
    const html = `
      <html>
        <body>
          <h1>First Heading</h1>
          <h1>Second Heading</h1>
        </body>
      </html>
    `

    expect(getH1FromHTML(html)).toBe('First Heading')
  })

  it('returns an empty string if no h1 tag is found', () => {
    const html = `
      <html>
        <body>
          <p>No heading here</p>
        </body>
      </html>
    `

    expect(getH1FromHTML(html)).toBe('')
  })

  it('trims whitespace from the h1 text content', () => {
    const html = `
      <html>
        <body>
          <h1>
            Hello World
          </h1>
        </body>
      </html>
    `

    expect(getH1FromHTML(html)).toBe('Hello World')
  })
})

describe('getFirstParagraphFromHTML', () => {
  it('returns the first paragraph inside <main> if it exists', () => {
    const html = `
      <html><body>
        <p>Outside paragraph.</p>
        <main>
          <p>Main paragraph.</p>
        </main>
      </body></html>
    `
    expect(getFirstParagraphFromHTML(html)).toBe('Main paragraph.')
  })

  it('falls back to the first paragraph if no <main> exists', () => {
    const html = `
      <html><body>
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </body></html>
    `
    expect(getFirstParagraphFromHTML(html)).toBe('First paragraph.')
  })

  it('returns empty string if no paragraph exists', () => {
    const html = `
      <html><body>
        <div>No paragraphs here</div>
      </body></html>
    `
    expect(getFirstParagraphFromHTML(html)).toBe('')
  })
})

describe('getURLsFromHTML', () => {
  it('finds absolute URLs', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <a href="https://blog.boot.dev/path">Link</a>
      </body></html>
    `

    const actual = getURLsFromHTML(html, baseURL)
    expect(actual).toEqual(['https://blog.boot.dev/path'])
  })

  it('converts relative URLs to absolute URLs', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <a href="/path">Relative Link</a>
      </body></html>
    `

    const actual = getURLsFromHTML(html, baseURL)
    expect(actual).toEqual(['https://blog.boot.dev/path'])
  })

  it('finds all anchor tags in HTML', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <a href="/one">One</a>
        <a href="/two">Two</a>
      </body></html>
    `

    const actual = getURLsFromHTML(html, baseURL)
    expect(actual).toEqual([
      'https://blog.boot.dev/one',
      'https://blog.boot.dev/two',
    ])
  })
})

describe('getImagesFromHTML', () => {
  it('finds absolute image URLs', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <img src="https://blog.boot.dev/logo.png" />
      </body></html>
    `

    const actual = getImagesFromHTML(html, baseURL)
    expect(actual).toEqual(['https://blog.boot.dev/logo.png'])
  })

  it('converts relative image URLs to absolute URLs', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <img src="/logo.png" alt="Logo" />
      </body></html>
    `

    const actual = getImagesFromHTML(html, baseURL)
    expect(actual).toEqual(['https://blog.boot.dev/logo.png'])
  })

  it('ignores images without src attribute', () => {
    const baseURL = 'https://blog.boot.dev'
    const html = `
      <html><body>
        <img alt="Missing src" />
      </body></html>
    `

    const actual = getImagesFromHTML(html, baseURL)
    expect(actual).toEqual([])
  })
})

test("extractPageData basic", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://blog.boot.dev",
    h1: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://blog.boot.dev/link1"],
    image_urls: ["https://blog.boot.dev/image1.jpg"],
  };

  expect(actual).toEqual(expected);
});

describe("getHTML", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns HTML when response is 200 and content-type is text/html", async () => {
    const mockHTML = "<html><body>Hello</body></html>"

    vi.spyOn(global, "fetch").mockResolvedValue({
      status: 200,
      headers: {
        get: () => "text/html",
      },
      text: async () => mockHTML,
    } as any)

    const result = await getHTML("https://example.com")

    expect(result).toBe(mockHTML)
  })

  it("returns undefined for 404 responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      status: 404,
      headers: {
        get: () => "text/html",
      },
    } as any)

    const result = await getHTML("https://example.com")

    expect(result).toBeUndefined()
  })

  it("returns undefined for non-html content", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      status: 200,
      headers: {
        get: () => "application/json",
      },
    } as any)

    const result = await getHTML("https://example.com")

    expect(result).toBeUndefined()
  })

  it("handles fetch throwing an error", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(
      new Error("Network error")
    )

    const result = await getHTML("https://example.com")

    expect(result).toBeUndefined()
  })
})


vi.mock("./crawl", async () => {
  const original = await vi.importActual("./crawl");
  return {
    ...original,
    getHTML: vi.fn(async (url: string) => {
      if (url === "https://example.com") return '<a href="/page1">Page 1</a>';
      if (url === "https://example.com/page1") return '<a href="/page2">Page 2</a>';
      if (url === "https://example.com/page2") return '';
      return '';
    }),
  };
});

describe("crawlPage", () => {
  it("crawls all internal pages", async () => {
    const pages = await crawlPage("https://example.com");
    expect(pages).toEqual({
      "example.com": 1,
      "example.com/page1": 1,
      "example.com/page2": 1,
    });
  });
});