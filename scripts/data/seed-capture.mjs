/**
 * A partial, manual capture of the public endpoints taken on 10 November 2026,
 * expanded here into the same raw shapes the live APIs return.
 *
 * Two uses: (1) adapter tests run against real response shapes and values;
 * (2) `npm run data:seed` builds a first snapshot so the site has real numbers
 * before the scheduled job has ever run. The capture is incomplete (some
 * responses were truncated when recorded), and every feed built from it is
 * labelled "seed" on the site until a live fetch replaces it.
 */

export const CAPTURED_ON = "2026-11-10";

// provider | tag | tier | quantization | prompt | completion | input_cache_read | uptime_last_30m | status
const ENDPOINTS = {
  "z-ai/glm-5.2|Z.ai: GLM 5.2|1781631930": `
Relace|relace||unknown|0.0000000324|0.0000071524|0.0000000324|100|0
Wafer|wafer/us||fp4|0.0000000341|0.000007|0.000000033|100|0
Wafer|wafer||fp4|0.00000019|0.000008|0.00000018|100|0
Cloudflare|cloudflare||unknown|0.00000019|0.000008|0.00000019|100|0
DeepInfra|deepinfra/fp4/flex|flex|fp4|0.00000045|0.00000144|0.000000084||0
DeepInfra|deepinfra/fp4||fp4|0.0000005625|0.0000018|0.000000105|100|0
Ambient|ambient/fp8||fp8|0.0000006|0.000002|0.00000015|100|0
StreamLake|streamlake/fp8||fp8|0.00000061306|0.00000192676|0.000000113854|100|0
CoreWeave|coreweave/fp4||fp4|0.00000062|0.00000242|0.00000014|100|0
Novita|novita/fp8||fp8|0.0000006496|0.0000020416|0.00000012064|100|0
Morph|morph/fp8||fp8|0.000000699|0.0000044|0.000000175||0
DigitalOcean|digitalocean||unknown|0.0000007|0.0000022|0.000000105|100|0
SiliconFlow|siliconflow/fp8||fp8|0.0000007|0.0000022|0.00000013|100|0
AtlasCloud|atlas-cloud/fp8||fp8|0.000000938|0.000002948|0.0000001742||0
Alibaba|alibaba/fp8||fp8|0.000000966|0.000003036|0.0000001932|100|0
Inceptron|inceptron/fp4||fp4|0.00000099|0.00000288|0.00000016|100|0
Alibaba|alibaba/fp8/us-east-1||fp8|0.00000112|0.00000352|0.000000224|100|0
Decart|decart/fast|priority|fp4|0.0000012|0.000008|0.00000048|100|0
Nebius|nebius/fp4||fp4|0.0000014|0.0000044|0.00000014|86.67|-2
Mistral|mistral/zdr||nvfp4|0.0000014|0.0000044|0.00000014|100|0
BaseTen|baseten/fp8/us||fp8|0.0000014|0.0000044|0.00000014|100|0
Together|together||unknown|0.0000014|0.0000044|0.00000026|100|0
Baidu|baidu/fp8||fp8|0.0000014|0.0000044|0.00000026|100|0
BaseTen|baseten/fp8||fp8|0.0000014|0.0000044|0.00000014|100|0
Venice|venice/fp8||fp8|0.0000014|0.0000044|0.00000026|100|0
GMICloud|gmicloud/fp8||fp8|0.0000014|0.0000044|0.00000026||0
Parasail|parasail/fp4||fp4|0.0000014|0.0000044|0.00000026|100|0
Friendli|friendli||unknown|0.0000014|0.0000044|0.00000026|100|0
Z.AI|z-ai/fp8||fp8|0.0000014|0.0000044|0.00000026|100|0
Mistral|mistral/eu||unknown|0.00000154|0.00000484|0.000000154||0
BaseTen|baseten/us/fast|priority|fp8|0.0000021|0.0000066|0.00000021|100|0
BaseTen|baseten/fast|priority|fp8|0.0000021|0.0000066|0.00000021|100|0
Baidu|baidu/fast|priority|fp4|0.00000225|0.00000788|0.00000056|100|0
Alibaba|alibaba/fast|priority|fp8|0.00000231|0.00000726|0.000000462|100|-2`,
  "moonshotai/kimi-k3|MoonshotAI: Kimi K3|1784215858": `
Wafer|wafer||mxfp4|0.0000002|0.00002|0.00000019|100|0
Relace|relace/fp4||fp4|0.000000227|0.0000105572|0.00000022|100|0
InferenceNet|inference-net/us||fp4|0.000000239|0.0000108|0.00000021|100|0
InferenceNet|inference-net/fp4||fp4|0.000000239|0.0000108|0.00000021|100|0
Wafer|wafer/us||mxfp4|0.00000036|0.0000119|0.000000359|100|0
InferenceNet|inference-net/fast|priority|fp4|0.0000005|0.00001188|0.00000035|100|0
Makora|makora/fp4||fp4|0.00000065|0.000015|0.00000023|100|0
Sail Research|sail-research/fp4/us||fp4|0.0000012|0.0000055|0.0000002|100|0
Sail Research|sail-research/fp4||fp4|0.0000012|0.0000055|0.0000002|100|0
AkashML|akashml/fp4||fp4|0.0000012|0.000014|0.0000012|100|0
Morph|morph/fp8||fp8|0.000001521|0.000025536|0.000000541|100|0
Decart|decart/mxfp4||mxfp4|0.00000165|0.00000825|0.000000165|100|0
Chutes|chutes/mxfp4||mxfp4|0.00000185|0.0000095|0.000000185||0
Fireworks|fireworks/spot||unknown|0.0000021|0.0000105|0.00000021|100|0
InferenceNet|inference-net/us/fast|priority|fp4|0.00000224|0.000014519|0.00000035|100|0
Phala|phala||unknown|0.00000255|0.00001275|0.000000255|100|0
DigitalOcean|digitalocean||unknown|0.00000255|0.00001295|0.000000255|100|0
DeepInfra|deepinfra/mxfp4||mxfp4|0.00000285|0.00001425|0.000000285|100|0
ParetoAlpha|pareto-alpha/us||unknown|0.000003|0.000015|0.0000003||0
Amazon Bedrock|amazon-bedrock/us-east-2||unknown|0.000003|0.000015|0.0000003|100|0
Parasail|parasail/fp4||fp4|0.000003|0.000015|0.0000003|100|0
Modal|modal/mxfp4||mxfp4|0.000003|0.000015|0.0000003||0
Together|together||unknown|0.000003|0.000015|0.0000003|100|0
Fireworks|fireworks||unknown|0.000003|0.000015|0.0000003|100|0
BaseTen|baseten/fp8||fp8|0.000003|0.000015|0.0000003||0
Moonshot AI|moonshotai/mxfp4||mxfp4|0.000003|0.000015|0.0000003|100|0
Alibaba|alibaba||unknown|0.00000345|0.00001725|0.000000345|100|0
Fireworks|fireworks/us||unknown|0.0000045|0.0000225|0.00000045||0
Fireworks|fireworks/fast|priority|unknown|0.0000045|0.0000225|0.00000045|100|0`,
  "deepseek/deepseek-v4.1-flash-1017|DeepSeek: DeepSeek V4.1 Flash 1017|1792225624": `
OpenInference|open-inference/fp4||fp4|0.00000002|0.000000106042|0.000000015|100|0
Reka|reka||unknown|0.00000004|0.0000005|0.00000003|100|0
Relace|relace||unknown|0.00000007|0.0000005|0.000000008|100|0
DeepInfra|deepinfra/fp8/flex|flex|fp8|0.0000000784|0.0000002352|0.000000002352||0
InferenceNet|inference-net/us||fp8|0.00000008|0.00000055|0.000000008|100|0
InferenceNet|inference-net/fp8||fp8|0.00000008|0.00000055|0.000000008|100|0
DeepInfra|deepinfra/fp8||fp8|0.000000098|0.000000294|0.00000000294|100|0
Morph|morph/fp8||fp8|0.000000098|0.0000006|0.000000007||0
Cloudflare|cloudflare||unknown|0.0000001|0.0000006|0.000000003|100|0
Sail Research|sail-research/fp4/us||fp4|0.000000101|0.00000015|0.000000006735|100|0
Sail Research|sail-research/fp4||fp4|0.000000101|0.00000015|0.000000006735|100|0
Wafer|wafer/mxfp4||mxfp4|0.00000013|0.0000005|0.000000008|100|0
Decart|decart/fp4||fp4|0.0000001365|0.000000546|0.00000000273|100|0
Ionstream|ionstream||unknown|0.00000014|0.00000039|0.000000012|100|0
DeepInfra|deepinfra/fp8/priority|priority|fp8|0.000000147|0.000000441|0.00000000441|100|0
DeepSeek|deepseek||unknown|0.00000015|0.0000006|0.000000003|100|0
Makora|makora/fp8||fp8|0.00000015|0.0000012|0.000000006|100|0
StreamLake|streamlake/fp8||fp8|0.0000001785|0.000000714|0.00000000357|100|0
GMICloud|gmicloud/fp8||fp8|0.00000018|0.00000072|0.0000000036|100|0
AtlasCloud|atlas-cloud/fp8||fp8|0.000000195|0.00000078|0.0000000039|100|0
Novita|novita/fp8||fp8|0.000000195|0.00000078|0.0000000039|100|0
Fireworks|fireworks/spot||unknown|0.00000021|0.00000084|0.0000000042|100|0
DigitalOcean|digitalocean||unknown|0.000000225|0.0000009|0.000000006|100|0
Modal|modal||unknown|0.00000025|0.000001|0.000000005|100|0
Baidu|baidu/fp8||fp8|0.00000028|0.00000113|0.000000006|100|0
Crusoe|crusoe/fp8||fp8|0.00000029|0.0000012|0.000000007|100|0
Nebius|nebius/fp8||fp8|0.0000003|0.0000012|0.000000006|100|0
Phala|phala||unknown|0.0000003|0.0000012|0.000000006|100|0
SiliconFlow|siliconflow/fp8||fp8|0.0000003|0.0000012|0.000000006|100|0
Together|together||unknown|0.0000003|0.0000012|0.000000006|100|0
Fireworks|fireworks||unknown|0.0000003|0.0000012|0.000000006|100|0
PrimeIntellect|primeintellect||unknown|0.0000003|0.0000012|0.000000006|100|0
BaseTen|baseten||unknown|0.0000003|0.0000012|0.000000007|100|0
Parasail|parasail/fp8||fp8|0.0000003|0.0000012|0.000000006|100|0
Alibaba|alibaba||unknown|0.00000033|0.00000132|0.000000033|100|0`,
  "minimax/minimax-m3.1-flash|MiniMax: MiniMax M3.1 Flash|1792379569": `
GMICloud|gmicloud/fp8||fp8|0.0000001425|0.00000057|0.00000001425|100|0
InferenceNet|inference-net/fp4||fp4|0.00000015|0.0000006|0.000000015|100|0
DigitalOcean|digitalocean||unknown|0.00000015|0.0000006|0.000000015|100|0
Novita|novita/fp16||fp16|0.00000015|0.0000006|0.000000015|100|0
Nebius|nebius/fp4||fp4|0.00000015|0.0000006|0.000000015|96.3|0
SambaNova|sambanova||unknown|0.00000015|0.0000006|0.000000015|100|0
ModelRun|modelrun/fp4||fp4|0.00000015|0.0000006|0.000000015|100|0
Parasail|parasail/fp8||fp8|0.00000015|0.0000006|0.000000015|100|0
InferenceNet|inference-net/fp4/us||fp4|0.00000015|0.0000006|0.000000015|100|0
Together|together||unknown|0.00000015|0.0000006|0.000000015|100|0
Minimax|minimax||unknown|0.00000015|0.0000006|0.000000015|100|0`,
  "openai/gpt-oss-120b|OpenAI: gpt-oss-120b|1754414231": `
Near AI|near-ai/fp4||fp4|0.00000003|0.00000015|0.000000015|100|0
Venice|venice/int4||int4|0.00000003|0.00000015|0.00000003|100|0
CoreWeave|coreweave/fp4||fp4|0.00000003|0.00000017|0.00000003|100|0
DekaLLM|dekallm/bf16||bf16|0.00000003|0.00000018|0.00000003|100|0
AkashML|akashml/bf16||bf16|0.00000003|0.000000187|0.00000003|100|0
DeepInfra|deepinfra/bf16||bf16|0.000000037|0.00000017||100|0
Crusoe|crusoe/bf16||bf16|0.00000005|0.00000025|0.00000005|100|0
Mancer 2|mancer/fp8||fp8|0.00000005|0.00000025||100|0
Novita|novita/fp4||fp4|0.00000005|0.00000025||100|0
DigitalOcean|digitalocean||unknown|0.00000006|0.00000042|0.000000012|100|0
BaseTen|baseten/fp4/us||fp4|0.0000001|0.0000005|0.0000001|100|0
BaseTen|baseten/fp4||fp4|0.0000001|0.0000005|0.0000001|100|0
Parasail|parasail/fp4||fp4|0.0000001|0.00000075|0.000000055|100|0
SambaNova|sambanova||unknown|0.00000014|0.00000095||100|0
Amazon Bedrock|amazon-bedrock/eu-west-1||unknown|0.00000015|0.0000006||100|0
Nebius|nebius/fp4||fp4|0.00000015|0.0000006||100|0
SiliconFlow|siliconflow/fp8||fp8|0.00000015|0.0000006|0.000000075|76.67|-2
Phala|phala||unknown|0.00000015|0.0000006||100|0
Together|together||unknown|0.00000015|0.0000006||100|0
Groq|groq||unknown|0.00000015|0.0000006|0.000000075|100|0
Mara|mara||unknown|0.00000015|0.00000075||100|0
Cerebras|cerebras/fp16||fp16|0.00000035|0.00000075|0.00000035|100|0
Amazon Bedrock|amazon-bedrock||unknown|0.00000015|0.0000006||100|0`,
};

const endpointsJson = (key, table) => {
  const [id, name, created] = key.split("|");
  return {
    data: {
      id, name, created: Number(created), description: "", architecture: {},
      endpoints: table.trim().split("\n").map((line) => {
        const [provider_name, tag, tier, quantization, prompt, completion, cache, uptime, status] = line.split("|");
        return {
          name: `${provider_name} | ${id}`, model_id: id, model_name: name, provider_name, tag,
          service_tier: tier || null, quantization,
          pricing: { prompt, completion, ...(cache ? { input_cache_read: cache } : {}), discount: 0 },
          status: Number(status), uptime_last_30m: uptime ? Number(uptime) : null,
          latency_last_30m: null, throughput_last_30m: null,
        };
      }),
    },
  };
};

export const openrouterEndpoints = Object.fromEntries(Object.entries(ENDPOINTS).map(([key, table]) => [key.split("|")[0], endpointsJson(key, table)]));

export const openrouterModels = {
  data: [
    { id: "baidu/ernie-5.5-flash-preview", hugging_face_id: "", name: "Baidu: ERNIE 5.5 Flash Preview", created: 1794333533, pricing: { prompt: "0.00000028", completion: "0.00000113", input_cache_read: "0.000000028" } },
    ...Object.keys(ENDPOINTS).map((key) => {
      const [id, name, created] = key.split("|");
      const builder = openrouterEndpoints[id].data.endpoints.at(-1).pricing;
      return {
        id, hugging_face_id: id, name, created: Number(created),
        // One captured listing carried a time-of-day override that doubles the input price in a daily window.
        pricing: { ...builder, ...(id === "minimax/minimax-m3.1-flash" ? { overrides: [{ utc_start: 100, utc_end: 1500, prompt: "0.00000015" }] } : {}) },
      };
    }),
    { id: "z-ai/glm-5.2:free", hugging_face_id: "z-ai/glm-5.2", name: "variant, must be skipped", created: 1781631930, pricing: { prompt: "0", completion: "0" } },
  ],
};

// event | month-end close | strike | yes_bid | yes_ask | last | volume | open interest
const H100_LADDERS = `
KXH100MS-26DEC|2027-01-01T04:59:59Z|2|0.95|0.99|0.89|1744|450
KXH100MS-26DEC|2027-01-01T04:59:59Z|2.25|0.94|1.00|0.93|3079|1866
KXH100MS-26DEC|2027-01-01T04:59:59Z|2.5|0.80|0.90|0.72|698|137
KXH100MS-26DEC|2027-01-01T04:59:59Z|2.75|0.80|0.89|0.53|133|24
KXH100MS-26DEC|2027-01-01T04:59:59Z|3|0.64|0.72|0.41|280.85|116.85
KXH100MS-26DEC|2027-01-01T04:59:59Z|3.25|0.46|0.55|0.31|48|26.65
KXH100MS-26DEC|2027-01-01T04:59:59Z|3.5|0.32|0.42|0.24|671.11|120
KXH100MS-26DEC|2027-01-01T04:59:59Z|3.75|0.26|0.36|0.05|37|12
KXH100MS-26DEC|2027-01-01T04:59:59Z|4|0.13|0.21|0.13|1537|1528
KXH100MS-27MAR|2027-04-01T03:59:59Z|2|0.74|0.84|0.75|1403.17|195.17
KXH100MS-27MAR|2027-04-01T03:59:59Z|2.25|0.66|0.76|0.63|11|4
KXH100MS-27MAR|2027-04-01T03:59:59Z|2.5|0.53|0.63|0.58|143|44
KXH100MS-27MAR|2027-04-01T03:59:59Z|2.75|0.46|0.56|0.53|109|29
KXH100MS-27MAR|2027-04-01T03:59:59Z|3|0.34|0.44|0.40|32|29
KXH100MS-27MAR|2027-04-01T03:59:59Z|3.25|0.26|0.36|0.33|22|17
KXH100MS-27MAR|2027-04-01T03:59:59Z|3.5|0.20|0.30|0.28|16|12
KXH100MS-27MAR|2027-04-01T03:59:59Z|3.75|0.15|0.25|0.23|37|35
KXH100MS-27MAR|2027-04-01T03:59:59Z|4|0.12|0.22|0.20|74|35
KXH100MS-27JUL|2027-08-01T03:59:59Z|2|0.65|0.73|0.76|1897.49|603.24
KXH100MS-27JUL|2027-08-01T03:59:59Z|2.25|0.60|0.68|0.66|1226.5|527
KXH100MS-27JUL|2027-08-01T03:59:59Z|2.5|0.52|0.60|0.58|1043.68|531.63
KXH100MS-27JUL|2027-08-01T03:59:59Z|2.75|0.40|0.48|0.49|670.75|487.75
KXH100MS-27JUL|2027-08-01T03:59:59Z|3|0.35|0.43|0.48|901.12|657
KXH100MS-27JUL|2027-08-01T03:59:59Z|3.25|0.29|0.37|0.43|2330|766
KXH100MS-27JUL|2027-08-01T03:59:59Z|3.5|0.22|0.30|0.31|2271.4|1154
KXH100MS-27JUL|2027-08-01T03:59:59Z|3.75|0.15|0.23|0.21|22324|9810
KXH100MS-27JUL|2027-08-01T03:59:59Z|4|0.12|0.20|0.24|9976|8102
KXH100MS-27AUG|2027-09-01T03:59:59Z|1|0.88|0.98|0.99|130|5
KXH100MS-27AUG|2027-09-01T03:59:59Z|1.25|0.82|0.91|0.94|328.99|311.99
KXH100MS-27AUG|2027-09-01T03:59:59Z|1.5|0.73|0.83|0.89|301.05|301.05
KXH100MS-27AUG|2027-09-01T03:59:59Z|1.75|0.65|0.75|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|2|0.58|0.68|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|2.25|0.51|0.61|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|2.5|0.44|0.54|0.59|98.89|8.23
KXH100MS-27AUG|2027-09-01T03:59:59Z|2.75|0.40|0.50|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|3|0.34|0.44|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|3.25|0.30|0.40|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|3.5|0.25|0.35|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|3.75|0.23|0.33|0|0|0
KXH100MS-27AUG|2027-09-01T03:59:59Z|4|0.18|0.28|0.20|410|410`;

export const kalshiMarkets = {
  KXH100MS: {
    cursor: "",
    markets: H100_LADDERS.trim().split("\n").map((line) => {
      const [event_ticker, close_time, k, bid, ask, last, vol, oi] = line.split("|");
      return {
        ticker: `${event_ticker}-${Number(k).toFixed(3)}`, event_ticker, market_type: "binary", strike_type: "greater",
        floor_strike: Number(k), yes_bid_dollars: Number(bid).toFixed(4), yes_ask_dollars: Number(ask).toFixed(4),
        last_price_dollars: Number(last).toFixed(4), volume_fp: Number(vol).toFixed(2), open_interest_fp: Number(oi).toFixed(2),
        close_time, status: "active", updated_time: "2026-09-09T17:31:15.835598Z",
      };
    }),
  },
};

// num_gpus | dph_total | reliability2 | geolocation | verification
const offers = (gpu_name, table) => ({
  offers: table.trim().split("\n").map((line, i) => {
    const [num_gpus, dph_total, reliability2, geolocation, verification] = line.split("|");
    return { id: i + 1, gpu_name, num_gpus: Number(num_gpus), dph_total: Number(dph_total), dph_base: Number(dph_total), reliability2: Number(reliability2), geolocation, verification, rentable: true, rented: false, resource_type: "gpu" };
  }),
});
export const vastOffers = {
  "H100 SXM": offers("H100 SXM", `
1|2.3444444444444446|0.9940287|Montana, US|verified
1|2.0681481481481483|0.9846028|Japan, JP|unverified
1|2.202222222222222|0.9972815|Germany, DE|verified
1|2.202222222222222|0.9911594|Germany, DE|verified
1|2.202222222222222|0.9942483|Latvia, LV|verified
1|3.002222222222222|0.998283|The Netherlands, NL|verified
1|2.202222222222222|0.9896233|Germany, DE|verified
2|4.001481481481481|0.9923635|Japan, JP|unverified
1|2.202222222222222|0.9917167|Germany, DE|verified
1|3.6342222222222227|0.994383|Czechia, CZ|verified
4|8.26814814814815|0.9846028|Japan, JP|unverified
1|2.1348148148148147|0.978762|Japan, JP|unverified
8|16.534814814814816|0.9846028|Japan, JP|unverified
1|4.08074074074074|0.9991778|, US|verified`),
  H200: offers("H200", `
1|1.975877192982456|0.8944618|Georgia, US|unverified
1|3.1652046783625734|0.9760571|Romania, RO|unverified
2|6.323099415204679|0.9760571|Romania, RO|unverified
1|4.344298245614035|0.9652122|Quebec, CA|verified
1|3.6198830409356724|0.9784029|Japan, JP|unverified
1|2.9909356725146194|0.9814905|Indonesia, ID|unverified
1|3.817251461988304|0.98826|Japan, JP|unverified
1|4.344298245614035|0.9528274|British Columbia, CA|verified
2|7.238304093567251|0.9784029|Japan, JP|unverified
1|6.0603070175438605|0.9900799|Japan, JP|verified
2|12.115570175438597|0.9900799|Japan, JP|verified
1|2.8969298245614037|0.8787382|Georgia, US|unverified
2|7.633040935672514|0.98826|Japan, JP|unverified
2|8.68640350877193|0.9528274|British Columbia, CA|verified`),
  B200: offers("B200", `
1|6.252083333333333|0.9913503|Oregon, US|verified
1|8.233333333333333|0.9986823|Virginia, US|verified
1|7.002083333333332|0.9615917|Virginia, US|unverified
1|11.885416666666666|0.9976859|, US|deverified
2|23.760416666666668|0.9976859|, US|deverified
1|12.510416666666666|0.9956414|, US|verified
2|14.002083333333331|0.9615917|Virginia, US|unverified
2|17.502083333333335|0.993931|, US|verified
4|35.00208333333333|0.993931|, US|verified
2|11.002777777777778|0.9154698|California, US|verified`),
};

export const nyfedSofr = {
  refRates: [
    { effectiveDate: "2026-11-09", type: "SOFR", percentRate: 3.88, percentPercentile1: 3.84, percentPercentile25: 3.86, percentPercentile75: 3.94, percentPercentile99: 3.96, volumeInBillions: 3100, revisionIndicator: "" },
    { effectiveDate: "2026-11-06", type: "SOFR", percentRate: 3.89, percentPercentile1: 3.85, percentPercentile25: 3.87, percentPercentile75: 3.94, percentPercentile99: 3.97, volumeInBillions: 3174, revisionIndicator: "" },
    { effectiveDate: "2026-11-05", type: "SOFR", percentRate: 3.92, percentPercentile1: 3.85, percentPercentile25: 3.9, percentPercentile75: 3.97, percentPercentile99: 4.0, volumeInBillions: 3256, revisionIndicator: "" },
  ],
};

export const ercot = {
  lastUpdated: "2026-11-10 16:02:00-0600",
  rtSppData: [
    { intervalEnding: "15:30", hbHubAvg: 28.37, hbNorth: 22.81, timestamp: "2026-11-10 15:30:00-0600" },
    { intervalEnding: "15:45", hbHubAvg: 32.48, hbNorth: 30.13, timestamp: "2026-11-10 15:45:00-0600" },
    { intervalEnding: "16:00", hbHubAvg: 36.11, hbNorth: 36.41, timestamp: "2026-11-10 16:00:00-0600" },
  ],
  damSppData: [],
};

/** Shape-only fixtures: the capture confirmed the field names but not these companies' values. */
export const twseShape = [
  { 出表日期: "1151017", 資料年月: "11509", 公司代號: "2330", 公司名稱: "台積電", 產業別: "半導體業", "營業收入-當月營收": "100000000", "營業收入-上月營收": "95000000", "營業收入-去年當月營收": "80000000", "營業收入-上月比較增減(%)": "5.26", "營業收入-去年同月增減(%)": "25.00", "累計營業收入-當月累計營收": "0", "累計營業收入-去年累計營收": "0", "累计營業收入-前期比較增減(%)": "0", 備註: "-" },
  { 出表日期: "1151017", 資料年月: "11509", 公司代號: "1101", 公司名稱: "台泥", 產業別: "水泥工業", "營業收入-當月營收": "1", "營業收入-去年同月增減(%)": "1.0", "營業收入-上月比較增減(%)": "1.0" },
];
export const fredCsvShape = "observation_date,SOFR\n2026-11-05,3.92\n2026-11-06,3.89\n2026-11-07,\n2026-11-08,.\n2026-11-09,3.88\n";
