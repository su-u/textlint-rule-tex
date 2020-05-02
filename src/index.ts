import { TextlintRuleModule } from "@textlint/types";

export interface Options {
    // if the Str includes `allows` word, does not report it
    allows?: string[];
}

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const {Syntax, RuleError, report, getSource} = context;
    const allows = options.allows || [];
    return {
        [Syntax.Str](node) { // "Str" node
            const text = getSource(node); // Get text
            const matches = /(?<=^\\label\{).*(?=:)/g.exec(text); // Found "bugs"
            const ShouldLabelPrefixes = ['sec', 'fig', 'eq', 'tab'];

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
                return ShouldLabelPrefixes.includes(match);
            })) {
                return;
            }
            const indexOfBugs = matches.index;
            const ruleError = new RuleError("区切り文字が適切ではありません。", {
                index: indexOfBugs
            });
            report(node, ruleError);
        }
    }
};
export default report;
