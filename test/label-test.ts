import TextLintTester from "textlint-tester";
import rule from "../src/label";
const tester = new TextLintTester();
tester.run("rule", rule, {
    valid: [
        // no problem
        "\\label{sec:スコアリング}",
        "\\newpage"
    ],
    invalid: [
        {
            text: "\\label{secスコアリング}",
            errors: [
                {
                    message: "「:」区切り文字が見つかりません。",
                    line: 1,
                }
            ]
        },
        {
            text: `\\label{seca:スコアリング}`,
            errors: [
                {
                    message: "ラベルのプレフィックスに「sec, fig, eq, tab」が含まれません。",
                    line: 1,
                },
            ]
        },
        {
            text: `\\section{スコアリング}\n\\label{seac:スコアリング}`,
            errors: [
                {
                    message: "ラベルのプレフィックスに「sec, fig, eq, tab」が含まれません。",
                    line: 1,
                },
            ]
        },

    ]
});
