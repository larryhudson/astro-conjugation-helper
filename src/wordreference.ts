import cheerio from 'cheerio';
import EleventyFetch from '@11ty/eleventy-fetch';

export async function fetchWordRefConjugationHtml(verb: string) {
    const wordReferenceUrl = new URL(`https://www.wordreference.com/conj/FrVerbs.aspx`)
    wordReferenceUrl.searchParams.set('v', verb);

    const wordReferenceHtml = await EleventyFetch(wordReferenceUrl.toString(), {
        duration: "365d",
        type: "text"
    });

    console.log("Got HTML for ", verb);

    return wordReferenceHtml;
}


export async function getConjugationsForVerb({ verb }: { verb: string }) {

    const wordReferenceHtml = await fetchWordRefConjugationHtml(verb);

    const $ = cheerio.load(wordReferenceHtml);

    const groupHeadings = $(".aa h4");

    const allConjugations = groupHeadings.map((_, h4Tag) => {
        const groupHeadingText = $(h4Tag).text();
        const tablesBeforeNextHeading = $(h4Tag).nextUntil('h4').filter('table');


        const conjugationsForThisGroup = tablesBeforeNextHeading.map((_, tableTag) => {
            const conjugationType = $(tableTag).find('th').first().text();

            const conjugationRows = $(tableTag).find('tr');

            const conjugationsInTable = $(conjugationRows).map((i, row) => {
                if (i === 0) return null;
                const person = $(row).find('th').first().text();
                const conjugation = $(row).find('td').last().text();
                return { person, conjugation }
            }).get();

            return {
                type: conjugationType,
                conjugations: conjugationsInTable
            }

        }).get()

        return {
            group: groupHeadingText,
            conjugations: conjugationsForThisGroup
        }

    }).get()



    return allConjugations;
}
