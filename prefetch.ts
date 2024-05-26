import { infinitiveVerbs } from "@src/constants"
import { fetchWordRefConjugationHtml } from "@src/wordreference";
import pMap from "p-map";

async function main() {

    await pMap(infinitiveVerbs, fetchWordRefConjugationHtml, { concurrency: 1 });
}

main();
