import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import puppeteer from 'puppeteer';

let browser = null;
let page = null;

const server = new Server(
  {
    name: 'puppeteer-browser',
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
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
        name: 'browser_navigate',
        description: 'Navigate to a URL in the browser',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'The URL to navigate to' },
          },
          required: ['url'],
        },
      },
      {
        name: 'browser_screenshot',
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
        name: 'browser_click',
        description: 'Click an element on the page by CSS selector',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector of the element to click' },
          },
          required: ['selector'],
        },
      },
      {
        name: 'browser_type',
        description: 'Type text into an element on the page',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector of the input element' },
            text: { type: 'string', description: 'Text to type' },
          },
          required: ['selector', 'text'],
        },
      },
      {
        name: 'browser_evaluate',
        description: 'Evaluate JavaScript code in the browser context',
        inputSchema: {
          type: 'object',
          properties: {
            script: { type: 'string', description: 'JavaScript code to execute' },
          },
          required: ['script'],
        },
      },
      {
        name: 'browser_get_html',
        description: 'Get the HTML content of the current page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'browser_close',
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
      case 'browser_navigate': {
        const p = await getPage();
        await p.goto(args.url, { waitUntil: 'networkidle2' });
        return { content: [{ type: 'text', text: `Navigated to ${args.url}` }] };
      }

      case 'browser_screenshot': {
        const p = await getPage();
        await p.screenshot({ path: args.path });
        return { content: [{ type: 'text', text: `Screenshot saved to ${args.path}` }] };
      }

      case 'browser_click': {
        const p = await getPage();
        await p.click(args.selector);
        return { content: [{ type: 'text', text: `Clicked element: ${args.selector}` }] };
      }

      case 'browser_type': {
        const p = await getPage();
        await p.type(args.selector, args.text);
        return { content: [{ type: 'text', text: `Typed "${args.text}" into ${args.selector}` }] };
      }

      case 'browser_evaluate': {
        const p = await getPage();
        const result = await p.evaluate(args.script);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'browser_get_html': {
        const p = await getPage();
        const html = await p.content();
        return { content: [{ type: 'text', text: html }] };
      }

      case 'browser_close': {
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
