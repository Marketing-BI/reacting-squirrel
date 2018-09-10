import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from 'texting-squirrel';

export default class TextComponent extends Component {

    static propTypes = {
        dictionaryKey: PropTypes.string.isRequired,
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        args: PropTypes.arrayOf(PropTypes.any),
    };

    static defaultProps = {
        tag: 'span',
        args: [],
    };

    static addDictionary(key, dictionary) {
        return Text.addDictionary(key, dictionary);
    }

    static setDictionary(key) {
        return Text.setDictionary(key);
    }

    static addFunction(name, fn) {
        return Text.addFunction(name, fn);
    }

    static get(key, ...args) {
        return Text.get(key, ...args);
    }

    static format(text, ...args) {
        return Text.format(text, ...args);
    }

    render() {
        const Tag = this.props.tag;
        const { args, dictionaryKey } = this.props;
        const props = {};
        Object.keys(this.props).forEach((k) => {
            if (['tag', 'args', 'dictionaryKey'].includes(k)) {
                return;
            }
            props[k] = this.props[k];
        });
        const value = Text.get.apply(Text, [dictionaryKey, ...args]);
        return <Tag {...props}>{value}</Tag>;
    }
}
