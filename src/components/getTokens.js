const numbers = Array.from(Array(10).keys()).toString();
const alphabet = [
  ...[...Array(26).keys()].map((i) => String.fromCharCode(i + 97)),
  ...[...Array(26).keys()].map((i) => String.fromCharCode(i + 65)),
];
const keyWords = [
  "auto","double","int","struct","break","else","long","switch","case","enum","register","char","extern","return","union","continue","for","signed","do","if","static","while","default","goto","sizeof","volatile","const","float","short","unsigned"
];

function isLetter(char) {
  for (let i in alphabet) if (alphabet[i] === char) return true;
  return false;
}

function isNumber(char) {
  for (let i in numbers) if (numbers[i] === char) return true;
  return false;
}
export default function getTokens(input) {
  
  let tokens = [];
  let str = input;
  const funcStr = str.slice();
  const subchars = funcStr.split("");
  let column = 1,
    row = 1;
  
  while (subchars.length !== 0) {
    let char = subchars.shift();
    if (char === " ") {
      column++;
    } else if (char === "[" || char === "]") {
      column++;
      tokens.push({
        content: char,
        token: char === "[" ? "left square bracket" : "righ tsquare bracket",
        row,
        startColumn: column - 1,
        endColumn: column - 1,
      });
    } else if (char === "{" || char === "}") {
      column++;
      tokens.push({
        content: char,
        token: char === "{" ? "left curly bracket" : "right curly bracket",
        row,
        startColumn: column - 1,
        endColumn: column - 1,
      });
    } else if (char === "(" || char === ")") {
      column++;
      tokens.push({
        content: char,
        token:
          char === "(" ? "left parenthes bracket" : "right parenthes bracket",
        row,
        startColumn: column - 1,
        endColumn: column - 1,
      });
    } else if (char === "\n") {
      column = 1;
      row++;
    } else if (char === ";") {
      let subString = char;
      if (subchars.shift() === "\n") {
        tokens.push({
          content: subString,
          token: "semicalon",
          row,
          startColumn: column,
          endColumn: column,
        });
        column = 1;
        row++;
      }
    } else if (isLetter(char)) {
      let startColumn = column;
      column++;
      let loop = true;
      let subString = char;
      while (loop) {
        char = subchars.shift();
        if (isLetter(char) || isNumber(char) || char === '_') {
          column++;
          subString = subString.concat(char);
        } else {
          let endColumn = column - 1;
          let token;
          subchars.unshift(char);
          loop = false;
          for (let i in keyWords) {
            if (subString === keyWords[i]) {
              token = "keyword";
              break;
            } else token = "identifier";
          }
          tokens.push({
            content: subString,
            token,
            row,
            startColumn,
            endColumn,
          });
        }
      }
    } else if (isNumber(char)) {
      let startColumn = column;
      column++;
      let loop = true;
      let subString = char;
      while (loop) {
        char = subchars.shift();
        if (isNumber(char)) {
          column++;
          subString = subString.concat(char);
        } else {
          if (!isNumber(char) && char === ".") {
            column++;
            subString = subString.concat(char);
            while (loop) {
              char = subchars.shift();
              if (isNumber(char)) {
                column++;
                subString = subString.concat(char);
              } else {
                if (char === "e" || char === "E") {
                  column++;
                  subString = subString.concat(char);
                  char = subchars.shift();
                  if (char === "+" || char === "-") {
                    column++;
                    subString = subString.concat(char);
                    char = subchars.shift();
                    if (isNumber(char)) {
                      column++;
                      subString = subString.concat(char);
  
                      while (loop) {
                        char = subchars.shift();
                        if (isNumber(char)) {
                          column++;
                          subString = subString.concat(char);
                        } else {
                          let endColumn = column - 1;
                          subchars.unshift(char);
                          loop = false;
                          tokens.push({
                            content: subString,
                            token: "scientific number",
                            row,
                            startColumn,
                            endColumn,
                          });
                        }
                      }
                    } else {
                      let endColumn = column - 1;
                      subchars.unshift(char);
                      loop = false;
                      tokens.push({
                        content: subString,
                        token: "not a valid token",
                        row,
                        startColumn,
                        endColumn,
                      });
                    }
                  } else {
                    let endColumn = column - 1;
                    subchars.unshift(char);
                    loop = false;
                    tokens.push({
                      content: subString,
                      token: "not a valid token",
                      row,
                      startColumn,
                      endColumn,
                    });
                  }
                } else {
                  let endColumn = column - 1;
                  subchars.unshift(char);
                  loop = false;
                  tokens.push({
                    content: subString,
                    token: "float",
                    row,
                    startColumn,
                    endColumn,
                  });
                }
              }
            }
          } else {
            let endColumn = column - 1;
            subchars.unshift(char);
            loop = false;
            tokens.push({
              content: subString,
              token: "number",
              row,
              startColumn,
              endColumn,
            });
          }
        }
      }
    } else if (char === "=") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "equal",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "-") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "-") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "decrement",
          row,
          startColumn,
          endColumn,
        });
      } else if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "minus operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "+") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "+") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "increment",
          row,
          startColumn,
          endColumn,
        });
      } else if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "pluse operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "/") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      }
      if (char === "*") {
        column++;
        let loop = true;
        subString = subString.concat(char);
        while (loop) {
          char = subchars.shift();
          if (char !== "*") {
            column++;
            subString = subString.concat(char);
          } else {
            column++;
            subString = subString.concat(char);
            char = subchars.shift();
            if (char !== "/") {
              column++;
              subString = subString.concat(char);
            } else {
              column++;
              subString = subString.concat(char);
              let endColumn = column - 1;
              loop = false;
              tokens.push({
                content: subString,
                token: "comment",
                row,
                startColumn,
                endColumn,
              });
            }
          }
        }
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "division operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "*") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "multipy operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "%") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "modulo operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "&") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "&") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "and (logical)",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "bitwise operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "|") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "|") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "or (logical)",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "bitwise operator",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "!") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "assignment operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "not (logical)",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === "<") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "relational operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "greater",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === ">") {
      let startColumn = column;
      column++;
      let subString = char;
      char = subchars.shift();
      if (char === "=") {
        subString = subString.concat(char);
        column++;
        let endColumn = column - 1;
        tokens.push({
          content: subString,
          token: "relational operator",
          row,
          startColumn,
          endColumn,
        });
      } else {
        subchars.unshift(char);
        let endColumn = startColumn;
        tokens.push({
          content: subString,
          token: "leser",
          row,
          startColumn,
          endColumn,
        });
      }
    } else if (char === '"') {
      let startColumn = column;
      column++;
      let subString = char;
      let loop = true;
      while (loop) {
        char = subchars.shift();
        if (char !== '"') {
          column++;
          subString = subString.concat(char);
        } else {
          subString = subString.concat(char);
          column++;
          let endColumn = column - 1;
          loop = false;
          tokens.push({
            content: subString,
            token: "String",
            row,
            startColumn,
            endColumn,
          });
        }
      }
    } else {
      tokens.push({
        content: char,
        token: "not a valid character",
        row,
        startColumn: column, 
        endColumn: column
      });
    }
  }
  return tokens;
}



