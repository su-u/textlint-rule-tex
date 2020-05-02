import TextLintTester from "textlint-tester";
import rule from "../src/label";
const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // no problem
        "\\label{sec:スコアリング}"
    ],
    invalid: [
        // single match
        {
            text: "\\label{secスコアリング}",
            errors: [
                {
                    message: "「:」区切り文字が見つかりません。",
                    line: 1,
                }
            ]
        },
        // multiple match
        {
            text: `\\label{seca:スコアリング}`,
            errors: [
                {
                    message: "区切り文字が適切ではありません。",
                    line: 1,
                },
            ]
        },

    ]
});
