"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("./result");
// think about FParser as "Array", it takes a parser, and offers some operation on that parser
// like Array.from('a', 'b').map(convertCase)
function FParser(initParser) {
    return {
        andThen(nextParser) {
            return FParser(initParser).bind((p1Res) => FParser(nextParser)
                .bind((p2Res) => (remain) => (0, result_1.Success)([p1Res, p2Res], remain))
                .unwrap());
        },
        orElse(otherParser) {
            return FParser((input) => initParser(input)
                .orElse(() => otherParser(input)));
        },
        //bind:: f:(T -> Parser<P>) -> FParser<T> -> FParser<P>
        bind(f) {
            return FParser((input) => initParser(input).cata({
                Failure: result_1.Failure,
                Success: (res, remain) => f(res)(remain)
            }));
        },
        parse(input) {
            return initParser(input);
        },
        unwrap() {
            return initParser;
        }
    };
}
function pchar(charToMatch) {
    return function (str) {
        if (str.length === 0) {
            return (0, result_1.Failure)("No more input");
        }
        const first = str[0];
        if (first === charToMatch) {
            const remaining = str.slice(1);
            return (0, result_1.Success)(charToMatch, remaining);
        }
        else {
            const msg = `Expecting '${charToMatch}'. Got '${first}'`;
            return (0, result_1.Failure)(msg);
        }
    };
}
const parserAandB = FParser(pchar("A")).andThen(pchar("B"));
console.log("and then =", parserAandB.parse("ABC"));
console.log("and then =", parserAandB.parse("AZC"));
const parserAorB = FParser(pchar("A")).orElse(pchar("B"));
console.log("or else =", parserAorB.parse("AC"));
console.log("or else =", parserAorB.parse("BC"));
console.log("or else =", parserAorB.parse("DC"));
const parserABCEForDEF = FParser(pchar("A"))
    .andThen(pchar("B"))
    .andThen(pchar("C"))
    .orElse(pchar("D"))
    .andThen(pchar("E"))
    .andThen(pchar("F"));
console.log("and then or else =", parserABCEForDEF.parse("ABCEF"));
console.log("and then or else =", parserABCEForDEF.parse("DEF"));
const parserABorDE = FParser(pchar("A")).andThen(pchar("B")).orElse(FParser(pchar("D")).andThen(pchar("E")).unwrap());
console.log("AB or DE", parserABorDE.parse("ABC"));
console.log("AB or DE", parserABorDE.parse("DEC"));
const anyOf = (...chars) => chars.map((c) => pchar(c));
const choice = function (listOfParsers) {
    return listOfParsers.reduce((prev, crr) => FParser(prev).orElse(crr).unwrap());
};
const any = choice(anyOf('A', 'B', 'C'));
console.log("any of =", any("A"));
console.log("any of =", any("B"));
console.log("any of =", any("C"));
//# sourceMappingURL=parser.js.map