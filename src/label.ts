import { TextlintRuleModule } from '@textlint/types';

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
            const text = getSource(node);
            const matches = /(?<=\\label\{).*(?=:)/gm.exec(text);
            const opt = Object.assign({}, defaultPrefixes, options);

            // console.log(text);
            if (!matches && /\\label\{/g.exec(text)) {
                const ruleError = new RuleError('ラベルに区切り文字「:」が見つかりません。');
                report(node, ruleError);
                return;
            } else if(!matches) {
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
