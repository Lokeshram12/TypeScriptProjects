import { it,test, expect,describe } from "vitest";
import { normalizeURL,getH1FromHTML ,getFirstParagraphFromHTML,getURLsFromHTML
    ,getImagesFromHTML
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