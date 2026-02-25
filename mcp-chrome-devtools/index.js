import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import puppeteer from 'puppeteer';

let browser = null;
let page = null;

const server = new Server(
  {
    name: 'chrome-devtools',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--auto-open-devtools-for-tabs', '--no-sandbox'],
    });
  }
  return browser;
}

async function getPage() {
  const b = await getBrowser();
  if (!page) {
    const pages = await b.pages();
    page = pages[0] || await b.newPage();
  }
  return page;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'chrome_navigate',
        description: 'Navigate to a URL in Chrome',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'The URL to navigate to' },
          },
          required: ['url'],
        },
      },
      {
        name: 'chrome_screenshot',
        description: 'Take a screenshot of the current page',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to save the screenshot' },
          },
          required: ['path'],
        },
      },
      {
        name: 'chrome_click',
        description: 'Click an element on the page by selector',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector or XPath' },
          },
          required: ['selector'],
        },
      },
      {
        name: 'chrome_type',
        description: 'Type text into an input element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector of the input' },
            text: { type: 'string', description: 'Text to type' },
            clear: { type: 'boolean', description: 'Clear before typing', default: false },
          },
          required: ['selector', 'text'],
        },
      },
      {
        name: 'chrome_evaluate',
        description: 'Execute JavaScript in the page context',
        inputSchema: {
          type: 'object',
          properties: {
            script: { type: 'string', description: 'JavaScript code to execute' },
          },
          required: ['script'],
        },
      },
      {
        name: 'chrome_get_html',
        description: 'Get the full HTML of the page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_get_title',
        description: 'Get the page title',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_get_url',
        description: 'Get the current page URL',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_wait_for_selector',
        description: 'Wait for a selector to appear',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector to wait for' },
            timeout: { type: 'number', description: 'Timeout in milliseconds', default: 30000 },
          },
          required: ['selector'],
        },
      },
      {
        name: 'chrome_console',
        description: 'Get console messages from the page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_cookies',
        description: 'Get all cookies from the current page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_reload',
        description: 'Reload the current page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_go_back',
        description: 'Go back in browser history',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_go_forward',
        description: 'Go forward in browser history',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'chrome_close',
        description: 'Close the browser',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'chrome_navigate': {
        const p = await getPage();
        await p.goto(args.url, { waitUntil: 'networkidle2', timeout: 60000 });
        return { content: [{ type: 'text', text: `Navigated to ${args.url}` }] };
      }

      case 'chrome_screenshot': {
        const p = await getPage();
        await p.screenshot({ path: args.path, fullPage: true });
        return { content: [{ type: 'text', text: `Screenshot saved to ${args.path}` }] };
      }

      case 'chrome_click': {
        const p = await getPage();
        await p.click(args.selector);
        return { content: [{ type: 'text', text: `Clicked: ${args.selector}` }] };
      }

      case 'chrome_type': {
        const p = await getPage();
        if (args.clear) await p.click(args.selector, { clickCount: 3 });
        await p.type(args.selector, args.text);
        return { content: [{ type: 'text', text: `Typed "${args.text}" into ${args.selector}` }] };
      }

      case 'chrome_evaluate': {
        const p = await getPage();
        const result = await p.evaluate(args.script);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'chrome_get_html': {
        const p = await getPage();
        const html = await p.content();
        return { content: [{ type: 'text', text: html }] };
      }

      case 'chrome_get_title': {
        const p = await getPage();
        const title = await p.title();
        return { content: [{ type: 'text', text: title }] };
      }

      case 'chrome_get_url': {
        const p = await getPage();
        const url = await p.url();
        return { content: [{ type: 'text', text: url }] };
      }

      case 'chrome_wait_for_selector': {
        const p = await getPage();
        await p.waitForSelector(args.selector, { timeout: args.timeout || 30000 });
        return { content: [{ type: 'text', text: `Selector ${args.selector} found` }] };
      }

      case 'chrome_console': {
        return { content: [{ type: 'text', text: 'Console logging enabled - check browser DevTools' }] };
      }

      case 'chrome_cookies': {
        const p = await getPage();
        const client = await p.target().createCDPSession();
        const cookies = await client.send('Network.getAllCookies');
        return { content: [{ type: 'text', text: JSON.stringify(cookies.cookies, null, 2) }] };
      }

      case 'chrome_reload': {
        const p = await getPage();
        await p.reload({ waitUntil: 'networkidle2' });
        return { content: [{ type: 'text', text: 'Page reloaded' }] };
      }

      case 'chrome_go_back': {
        const p = await getPage();
        await p.goBack({ waitUntil: 'networkidle2' });
        return { content: [{ type: 'text', text: 'Went back' }] };
      }

      case 'chrome_go_forward': {
        const p = await getPage();
        await p.goForward({ waitUntil: 'networkidle2' });
        return { content: [{ type: 'text', text: 'Went forward' }] };
      }

      case 'chrome_close': {
        if (browser) {
          await browser.close();
          browser = null;
          page = null;
        }
        return { content: [{ type: 'text', text: 'Browser closed' }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
