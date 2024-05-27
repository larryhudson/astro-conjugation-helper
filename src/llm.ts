export async function generateSentence({
    verb,
    person,
    conjugationGroup,
    conjugationSubgroup,
    correctConjugation,
    topic
}: {
    verb: string;
    person: string;
    conjugationGroup: string;
    conjugationSubgroup: string;
    correctConjugation: string;
    topic?: string
}) {

    const llmPrompt = `Voici un verbe français :
<verbe>${verb}</verbe>

Voici la personne grammaticale :  
<personne>${person}</personne>

Voici le type de conjugaison :
<conjugaison>${conjugationGroup} - ${conjugationSubgroup}</conjugaison>

Voici la conjugaison correcte du verbe pour cette personne et ce type de conjugaison :
<conjugue>${correctConjugation}</conjugue>

Veuillez utiliser la conjugaison correcte dans une phrase française simple. La phrase doit démontrer clairement l'utilisation correcte de la conjugaison donnée. 

Écrivez uniquement la phrase, en remplaçant la conjugaison du verbe par [CONJUGAISON]. Ne remplacez pas le pronom personnel.

${topic ? `Utilisez ce sujet lors de la rédaction de la phrase :
<sujet>${topic}</sujet>` : ''}`

    const llmResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: llmPrompt }
            ]
        })
    })

    if (!llmResponse.ok) {
        throw new Error('Failed to fetch LLM response')
    }

    const llmJson = await llmResponse.json();

    const sentence = llmJson.choices[0].message.content;

    return sentence;
}
