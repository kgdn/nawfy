import filter from './filter.json';
import words from "./dictionary.json"
const dictionary = Object.keys(words)[0].split("\n");

export default function filterWord(word) {
    // check for naughty stuff
    if (filter.slurs.includes(word)) {
        return "naughty naughty";
    }

    // check for countries
    if (filter.countries.includes(word)) {
        return "countries not allowed";
    }

    // check for names
    if (filter.names.includes(word)) {
        return "names not allowed";
    }

    // check for valid word
    if (dictionary.includes(word.toLowerCase())) {
        return "valid word";
    }
    else {
        return "speek inglish";
    }
}