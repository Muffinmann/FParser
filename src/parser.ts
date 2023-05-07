import { Parser } from './types';
import { Success, Failure } from './result';


// think about FParser as "Array", it takes a parser, and offers some operation on that parser
// like Array.from('a', 'b').map(convertCase)
function FParser<T>(initParser: Parser<T>) {
  return {
    andThen<P>(nextParser: Parser<P>) {
      return FParser(initParser).bind(
        (p1Res) => FParser(nextParser)
          .bind((p2Res) => (remain: string) => Success([p1Res, p2Res], remain))
          .unwrap()
      )
    },
    orElse<V>(otherParser: Parser<V>) {
      return FParser<V | T>(
        (input: string) => initParser(input)
          .orElse(() => otherParser(input))
      )
    },
    //bind:: f:(T -> Parser<P>) -> FParser<T> -> FParser<P>
    bind<P>(f: (v: T) => Parser<P>) {
      return FParser((input: string) => initParser(input).cata({
        Failure,
        Success: (res, remain) => f(res)(remain)
      }))
    },

    parse(input: string) {
      return initParser(input)
    },

    unwrap() {
      return initParser
    }
  }
}
type ListParser<T> = T extends unknown[] ? T[number] : never;

function pchar<T extends string>(charToMatch: T): Parser<T> {
  return function (str: string) {
    if (str.length === 0) {
      return Failure("No more input");
    }

    const first = str[0];
    if (first === charToMatch) {
      const remaining = str.slice(1);
      return Success(charToMatch, remaining)
    } else {
      const msg = `Expecting '${charToMatch}'. Got '${first}'`;
      return Failure(msg);
    }
  };
}

const parserAandB = FParser(pchar("A")).andThen(pchar("B"))
console.log("and then =", parserAandB.parse("ABC"))
console.log("and then =", parserAandB.parse("AZC"))

const parserAorB = FParser(pchar("A")).orElse(pchar("B"))
console.log("or else =", parserAorB.parse("AC"))
console.log("or else =", parserAorB.parse("BC"))
console.log("or else =", parserAorB.parse("DC"))

const parserABCEForDEF = FParser(pchar("A"))
  .andThen(pchar("B"))
  .andThen(pchar("C"))
  .orElse(pchar("D"))
  .andThen(pchar("E"))
  .andThen(pchar("F"))
console.log("and then or else =", parserABCEForDEF.parse("ABCEF"))
console.log("and then or else =", parserABCEForDEF.parse("DEF"))

const parserABorDE = FParser(pchar("A")).andThen(pchar("B")).orElse(
  FParser(pchar("D")).andThen(pchar("E")).unwrap()
)

console.log("AB or DE", parserABorDE.parse("ABC"))
console.log("AB or DE", parserABorDE.parse("DEC"))

const anyOf = <T extends string>(...chars: T[]) => chars.map((c) => pchar(c))
const choice = function <T>(listOfParsers: Parser<T>[]) {
  return listOfParsers.reduce((prev, crr) => FParser(prev).orElse(crr).unwrap())
}
const any = choice(anyOf('A', 'B', 'C'))

console.log("any of =", any("A"))
console.log("any of =", any("B"))
console.log("any of =", any("C"))