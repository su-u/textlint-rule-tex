import { TextlintRuleModule } from "@textlint/types";

export interface Options {
    allows?: string[];
}

const defaultPrefixes = {
    labelPrefix: ['sec', 'fig', 'eq', 'tab']
};

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const {Syntax, RuleError, report, getSource} = context;
    const allows = options.allows || [];
    return {
        [Syntax.Str](node) {
            const text = getSource(node); // Get text
            const matches = /(?<=^\\label\{).*(?=:)/g.exec(text);
            const opt = Object.assign({}, defaultPrefixes, options);

            if (!matches) {
                const ruleError = new RuleError("「:」区切り文字が見つかりません。");
                report(node, ruleError);
                return;
            }
            const isIgnored = allows.some(allow => text.includes(allow));
            if (isIgnored) {
                return;
            }
            if (matches.every(match => {
                return opt.labelPrefix.includes(match);
            })) {
                return;
            }
            const indexOfBugs = matches.index;
            const ruleError = new RuleError(`ラベルのプレフィックスに「${opt.labelPrefix.join(', ')}」が含まれません。`, {
                index: indexOfBugs
            });
            report(node, ruleError);
        }
    }
};
export default report;
