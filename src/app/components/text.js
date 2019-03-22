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
        Text.addDictionary(key, dictionary);
        return this;
    }

    static setDictionary(key) {
        Text.setDictionary(key);
        return this;
    }

    static addFunction(name, fn) {
        Text.addFunction(name, fn);
        return this;
    }

    static get(key, ...args) {
        return Text.get(key, ...args);
    }

    static format(text, ...args) {
        return Text.format(text, ...args);
    }

    render() {
        const {
            args,
            dictionaryKey,
            tag,
            ...props
        } = this.props;
        const Tag = tag;
        const value = Text.get.apply(Text, [dictionaryKey, ...args]);
        return <Tag {...props}>{value}</Tag>;
    }
}
