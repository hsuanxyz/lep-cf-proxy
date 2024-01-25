/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	API_URL: string;
	API_TOKEN: string;
}

const CORS_HEADERS: Record<string, string> = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "POST, OPTIONS",
	"access-control-allow-headers": "Content-Type, Authorization",
};

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (req.method === "OPTIONS") {
			return new Response(null, {
				headers: CORS_HEADERS,
			});
		}
		const { pathname, search } = new URL(req.url);
		const url = new URL(pathname + search, env.API_URL).href;

		const headers = new Headers();
		headers.set("Accept", `image/jpeg`);
		headers.set("Authorization", `Bearer ${env.API_TOKEN}`);
		headers.set(
			"Content-Type",
			req.headers.get("Content-Type") || "application/json",
		);

		const res = await fetch(url.toString(), {
			body: req.body,
			method: req.method,
			headers,
		});

		const resHeaders = new Headers(res.headers);
		Object.keys(CORS_HEADERS).forEach((key) => {
			resHeaders.set(key, CORS_HEADERS[key]);
		});

		return new Response(res.body, {
			status: res.status,
			headers: resHeaders,
		})

	},
};
