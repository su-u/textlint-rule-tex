import TextLintTester from 'textlint-tester';
import rule from '../src/label';
const tester = new TextLintTester();
tester.run('rule', rule, {
    valid: [
        '\\label{sec:スコアリング}',
        '\\newpage'
    ],
    invalid: [
        {
            text: '\\label{secスコアリング}',
            errors: [
                {
                    message: 'ラベルに区切り文字「:」が見つかりません。',
                    line: 1,
                }
            ]
        },
        {
            text: '\\label{seca:スコアリング}',
            errors: [
                {
                    message: 'ラベルのプレフィックスに「sec, fig, eq, tab」が含まれません。',
                    line: 1,
                },
            ]
        },
    ]
});
