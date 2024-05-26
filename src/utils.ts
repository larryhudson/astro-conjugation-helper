import { persons } from "./constants"

export function getRandomArrItem(arr: any[]) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex] || null
}

export function lookupCorrectConjugation({
    conjugationsForVerb,
    conjugationGroup,
    conjugationSubgroup,
    person
}) {

    console.log({ conjugationsForVerb, conjugationGroup, conjugationSubgroup, person })
    const personIndex = persons.indexOf(person)
    try {


        return conjugationsForVerb
            .find(group => group.group === conjugationGroup)
            .conjugations
            .find(subgroup => subgroup.type === conjugationSubgroup)
            .conjugations
        [personIndex]
            .conjugation

    } catch (e) {
        console.log(e)
        return null
    }
}
